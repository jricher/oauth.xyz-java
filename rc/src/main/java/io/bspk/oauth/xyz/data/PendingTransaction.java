package io.bspk.oauth.xyz.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import io.bspk.oauth.xyz.crypto.Hash.HashMethod;
import io.bspk.oauth.xyz.data.api.AccessTokenResponse;
import io.bspk.oauth.xyz.data.api.InteractResponse;
import io.bspk.oauth.xyz.data.api.TransactionContinueRequest;
import io.bspk.oauth.xyz.data.api.TransactionRequest;
import io.bspk.oauth.xyz.data.api.TransactionResponse;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author jricher
 *
 */
@Data
@Accessors(chain = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class PendingTransaction {

	@Data
	@Accessors(chain = true)
	@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
	public class Entry {
		private @Id String id = new ObjectId().toHexString();
		private TransactionRequest request;
		private TransactionContinueRequest cont;
		private TransactionResponse response;
	}

	private @Id String id;
	private List<Entry> entries = new ArrayList<>();
	private String owner;
	private String callbackId;
	private String clientNonce;
	private String serverNonce;
	private HashMethod hashMethod;
	private Key key;
	private String keyHandle;
	private String continueUri;
	private String continueToken;
	private String accessToken;
	private Key accessTokenKey;
	private String rsResponse;
	private String userCode;
	private String userCodeUrl;
	private String interactionUrl;
	private Map<String, String> multipleAccessTokens = Collections.emptyMap();
	private Map<String, Key> multipleAccessTokenKeys = Collections.emptyMap();
	private Map<String, String> multipleRsResponse = new HashMap<>();

	public PendingTransaction add (TransactionResponse response) {
		entries.add(new Entry().setResponse(response));

		return processResponse(response);
	}

	public PendingTransaction add (TransactionContinueRequest request, TransactionResponse response) {
		entries.add(new Entry().setCont(request).setResponse(response));

		return processResponse(response);
	}

	public PendingTransaction add (TransactionRequest request, TransactionResponse response) {
		entries.add(new Entry().setRequest(request).setResponse(response));

		return processResponse(response);
	}

	private PendingTransaction processResponse(TransactionResponse response) {
		if (response.getCont() != null) {
			// if there's a continuation section, update the values given
			if (response.getCont().getAccessToken() != null) {
				setContinueToken(response.getCont().getAccessToken().getValue());

				// set the key if an explicit one is given, otherwise keep what we have
				if (response.getCont().getAccessToken().getKey() != null) {
					setKey(response.getCont().getAccessToken().getKey());
				}
			}

			setContinueUri(response.getCont().getUri());
		} else {
			// otherwise clear it out
			setContinueToken(null);
			setContinueUri(null);
			setKey(null);
		}

		if (response.getAccessToken() != null) {
			if (response.getAccessToken().isMultiple()) {
				List<AccessTokenResponse> tokenResponses = response.getAccessToken().asMultiple();

				setMultipleAccessTokens(tokenResponses.stream()
					.collect(Collectors.toMap(
						t -> t.getLabel(),
						t -> t.getValue())));

				setMultipleAccessTokenKeys(tokenResponses.stream()
					.collect(Collectors.toMap(
						t -> t.getLabel(),
						t -> {
							if (t.isBound()) {
								if (t.getKey() == null) {
									// the token is bound but there's no other key, use the client's key
									return getKey();
								} else {
									return t.getKey();
								}
							} else {
								return null;
							}
						}
						)));
			} else {
				AccessTokenResponse tokenResponse = response.getAccessToken().asSingle();
				setAccessToken(tokenResponse.getValue());
				if (tokenResponse.isBound()) {
					if (tokenResponse.getKey() != null) {
						setAccessTokenKey(tokenResponse.getKey());
					} else {
						setAccessTokenKey(getKey());
					}
				}
			}
		}

		if (response.getInteract() != null) {
			InteractResponse interact = response.getInteract();
			if (interact.getUserCode() != null) {
				setUserCode(interact.getUserCode().getCode());
				setUserCodeUrl(interact.getUserCode().getUrl());
			}

			if (interact.getRedirect() != null) {
				setInteractionUrl(interact.getRedirect());
			}

			if (interact.getCallback() != null) {
				setServerNonce(interact.getCallback());
			}
		}

		return this;
	}

}
