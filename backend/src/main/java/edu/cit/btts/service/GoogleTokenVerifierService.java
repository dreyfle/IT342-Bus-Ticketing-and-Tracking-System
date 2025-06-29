package edu.cit.btts.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class GoogleTokenVerifierService {

  @Value("${google.client.id}")
  private String googleClientId;

  public GoogleIdToken.Payload verify(String idTokenString) throws GeneralSecurityException, IOException {
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleClientId))
            // If you have multiple clients (Android, iOS), you can add them to .setAudience
            // Or you can specify setAcceptedIssuers for flexibility
            .build();

    GoogleIdToken idToken = verifier.verify(idTokenString);
    if (idToken != null) {
        return idToken.getPayload();
    } else {
        return null;
    }
  }
}
