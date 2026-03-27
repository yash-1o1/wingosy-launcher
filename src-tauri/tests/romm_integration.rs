/// Integration tests against a live RomM server.
/// Run with: cargo test --test romm_integration -- --ignored --nocapture

#[cfg(test)]
mod romm_live_tests {
    fn load_env() -> (String, String, String) {
        dotenvy::from_filename("../.env").ok();
        let url = std::env::var("ROMM_SERVER_URL").expect("ROMM_SERVER_URL not set");
        let user = std::env::var("ROMM_USERNAME").expect("ROMM_USERNAME not set");
        let pass = std::env::var("ROMM_PASSWORD").expect("ROMM_PASSWORD not set");
        (url, user, pass)
    }

    fn make_client() -> reqwest::Client {
        reqwest::Client::builder().cookie_store(true).build().unwrap()
    }

    async fn authenticate(client: &reqwest::Client, url: &str, user: &str, pass: &str) -> String {
        let resp = client
            .post(format!("{}/api/token", url))
            .form(&[
                ("username", user), ("password", pass),
                ("grant_type", "password"),
                ("scope", "me.read me.write roms.read platforms.read roms.user.read roms.user.write"),
            ])
            .send().await.expect("Failed to connect");
        assert!(resp.status().is_success(), "Auth failed: {}", resp.status());
        let body: serde_json::Value = resp.json().await.unwrap();
        body["access_token"].as_str().unwrap().to_string()
    }

    #[tokio::test]
    #[ignore]
    async fn auth_returns_valid_jwt_with_scopes() {
        let (url, user, pass) = load_env();
        let client = make_client();
        let token = authenticate(&client, &url, &user, &pass).await;

        let parts: Vec<&str> = token.split('.').collect();
        assert_eq!(parts.len(), 3, "JWT should have 3 parts");
        let payload: serde_json::Value = serde_json::from_slice(&base64_decode(parts[1])).unwrap();
        let scopes = payload["scopes"].as_str().unwrap_or("");
        assert!(scopes.contains("roms.read"), "Missing roms.read scope");
        assert!(scopes.contains("platforms.read"), "Missing platforms.read scope");
        println!("JWT OK: sub={}, scopes={}", payload["sub"], scopes);
    }

    #[tokio::test]
    #[ignore]
    async fn auth_bad_password_rejected() {
        let (url, user, _) = load_env();
        let client = make_client();
        let resp = client.post(format!("{}/api/token", url))
            .form(&[("username", user.as_str()), ("password", "wrong")])
            .send().await.unwrap();
        assert!(!resp.status().is_success());
        println!("Bad password correctly rejected: {}", resp.status());
    }

    #[tokio::test]
    #[ignore]
    async fn heartbeat_returns_version() {
        let (url, _, _) = load_env();
        let client = make_client();
        let body: serde_json::Value = client.get(format!("{}/api/heartbeat", url))
            .send().await.unwrap().json().await.unwrap();
        let version = body["SYSTEM"]["VERSION"].as_str().unwrap_or("?");
        assert!(!version.is_empty());
        println!("RomM v{}", version);
    }

    #[tokio::test]
    #[ignore]
    async fn fetch_platforms_with_schema_validation() {
        let (url, user, pass) = load_env();
        let client = make_client();
        let token = authenticate(&client, &url, &user, &pass).await;

        let platforms: Vec<serde_json::Value> = client
            .get(format!("{}/api/platforms", url))
            .header("Authorization", format!("Bearer {}", token))
            .send().await.unwrap().json().await.unwrap();

        assert!(!platforms.is_empty(), "No platforms");
        for p in &platforms {
            assert!(p["id"].is_number(), "Missing 'id'");
            assert!(p["slug"].is_string(), "Missing 'slug'");
            assert!(p["name"].is_string(), "Missing 'name'");
            assert!(p["rom_count"].is_number(), "Missing 'rom_count'");
        }
        println!("{} platforms validated", platforms.len());
        for p in &platforms {
            let count = p["rom_count"].as_i64().unwrap_or(0);
            if count > 0 {
                println!("  {} ({}) — {} ROMs", p["name"].as_str().unwrap_or("?"), p["slug"].as_str().unwrap_or("?"), count);
            }
        }
    }

    #[tokio::test]
    #[ignore]
    async fn fetch_roms_paginated_with_schema_validation() {
        let (url, user, pass) = load_env();
        let client = make_client();
        let token = authenticate(&client, &url, &user, &pass).await;

        let resp: serde_json::Value = client
            .get(format!("{}/api/roms", url))
            .query(&[("limit", "5"), ("offset", "0")])
            .header("Authorization", format!("Bearer {}", token))
            .send().await.unwrap().json().await.unwrap();

        assert!(resp["items"].is_array(), "Response missing 'items' array");
        assert!(resp["total"].is_number(), "Response missing 'total'");

        let items = resp["items"].as_array().unwrap();
        let total = resp["total"].as_i64().unwrap();
        println!("Fetched {}/{} ROMs", items.len(), total);

        for rom in items {
            assert!(rom["id"].is_number(), "ROM missing 'id'");
            assert!(rom["name"].is_string(), "ROM missing 'name'");
            assert!(rom["fs_name"].is_string(), "ROM missing 'fs_name'");
            assert!(rom["platform_slug"].is_string(), "ROM missing 'platform_slug'");
        }

        for rom in items.iter().take(3) {
            println!("  {} ({})", rom["name"].as_str().unwrap_or("?"), rom["platform_slug"].as_str().unwrap_or("?"));
        }
    }

    #[tokio::test]
    #[ignore]
    async fn cover_art_downloadable() {
        let (url, user, pass) = load_env();
        let client = make_client();
        let token = authenticate(&client, &url, &user, &pass).await;

        let resp: serde_json::Value = client
            .get(format!("{}/api/roms", url))
            .query(&[("limit", "20"), ("offset", "0")])
            .header("Authorization", format!("Bearer {}", token))
            .send().await.unwrap().json().await.unwrap();

        let items = resp["items"].as_array().unwrap();
        let with_cover = items.iter().find(|r| r["url_cover"].is_string());

        match with_cover {
            Some(rom) => {
                let cover_url = rom["url_cover"].as_str().unwrap();
                let cover_resp = reqwest::get(cover_url).await.unwrap();
                assert!(cover_resp.status().is_success(), "Cover download failed");
                let bytes = cover_resp.bytes().await.unwrap();
                assert!(bytes.len() > 100, "Cover too small: {} bytes", bytes.len());
                println!("Cover for '{}': {} bytes from {}", rom["name"].as_str().unwrap_or("?"), bytes.len(), cover_url);
            }
            None => println!("SKIP: No ROMs with covers"),
        }
    }

    #[tokio::test]
    #[ignore]
    async fn full_sync_simulation() {
        let (url, user, pass) = load_env();
        let client = make_client();
        let token = authenticate(&client, &url, &user, &pass).await;

        let platforms: Vec<serde_json::Value> = client
            .get(format!("{}/api/platforms", url))
            .header("Authorization", format!("Bearer {}", token))
            .send().await.unwrap().json().await.unwrap();

        let mut total_roms = 0u64;
        let mut total_covers = 0u64;
        let mut total_with_metadata = 0u64;

        for platform in &platforms {
            let pid = platform["id"].as_i64().unwrap();
            let slug = platform["slug"].as_str().unwrap_or("?");
            let count = platform["rom_count"].as_i64().unwrap_or(0);
            if count == 0 { continue; }

            let resp: serde_json::Value = client
                .get(format!("{}/api/roms", url))
                .query(&[("platform_id", pid.to_string()), ("limit", "100".into()), ("offset", "0".into())])
                .header("Authorization", format!("Bearer {}", token))
                .send().await.unwrap().json().await.unwrap();

            let items = resp["items"].as_array().unwrap();
            let covers = items.iter().filter(|r| r["url_cover"].is_string()).count();
            let with_meta = items.iter().filter(|r| r["igdb_id"].is_number()).count();

            total_roms += items.len() as u64;
            total_covers += covers as u64;
            total_with_metadata += with_meta as u64;

            println!("  {}: {} ROMs, {} covers, {} with IGDB", slug, items.len(), covers, with_meta);
        }

        println!("\nSync summary:");
        println!("  Platforms: {}", platforms.len());
        println!("  Total ROMs: {}", total_roms);
        println!("  With covers: {}", total_covers);
        println!("  With IGDB metadata: {}", total_with_metadata);

        assert!(total_roms > 0, "No ROMs found");
    }

    fn base64_decode(input: &str) -> Vec<u8> {
        let padded = match input.len() % 4 {
            2 => format!("{}==", input),
            3 => format!("{}=", input),
            _ => input.to_string(),
        };
        let padded = padded.replace('-', "+").replace('_', "/");
        fn decode_group(chars: &[u8]) -> Vec<u8> {
            let table = |c: u8| -> u8 { match c { b'A'..=b'Z' => c-b'A', b'a'..=b'z' => c-b'a'+26, b'0'..=b'9' => c-b'0'+52, b'+' => 62, b'/' => 63, _ => 0 } };
            let mut out = Vec::new();
            if chars.len() >= 2 { out.push((table(chars[0])<<2)|(table(chars[1])>>4)); }
            if chars.len() >= 3 && chars[2] != b'=' { out.push((table(chars[1])<<4)|(table(chars[2])>>2)); }
            if chars.len() >= 4 && chars[3] != b'=' { out.push((table(chars[2])<<6)|table(chars[3])); }
            out
        }
        padded.as_bytes().chunks(4).flat_map(decode_group).collect()
    }
}
