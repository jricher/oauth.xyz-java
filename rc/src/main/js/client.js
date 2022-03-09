// Client page

import React from 'react';
import ReactDOM from 'react-dom';
import http from './http';
import { Button, Badge, Row, Col, Container, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardHeader, Input, Form, FormGroup, Label, TextArea } from 'reactstrap';
import { FaClone } from 'react-icons/fa';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import QRCode from 'qrcode.react';

class Client extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			transactions: [],
			instances: {},
			grantEndpoint: 'https://gnap-as.herokuapp.com/api/as/transaction',
			privateKey: `{
    "p": "zA_NmnceZ4UEPwJvTfrGcRn4ZB855TVOgULtVRzbMcRXWnyDi9KDlKShIoXWxvCiwniP0fevRLQ-3L7iNfA7cLy7oIrJeGUmbpCSwhqzjZupcDVHxM8QdhFDTbjhv7s3zj3EC3iPih_lal7loUbzdyYA7mvu5THfWmfBJ9DBAuM",
    "kty": "RSA",
    "q": "o7-udAWbLhqKHGxWym6JWuxFc0Kyap2av5gb_sm2out17vN8gROnRhSKybodzWtwAIdb2s5hXyggyrPGPMsPncrvXJGgH3U14045aJ5-c1p5TqcQHmh604DCRbTwuhqJFkDhWtLR8u7WO4ZVXINZvoOtYaSaYHyVWjOCk6Mxd90",
    "d": "gA-lFERDsbm3pX6QTc7eSzu7KGPkE_AyJ9waVp1cwMbYPWabrOgXv9WDpQl1IaW1k1HUr5G4wOynTYHO0E-ZCDNNJFuqXn10Sw3g7di_6hjIMCRtd5JWnnWMFLghF8HlJY908JT5wxgNgG103zHOvR5jTfHnUqCaTDghx8YbDGghLdCmIVvtm72V7EWsh0_OUHaCLfH8TZdlQxunYszLMwab4X8Lctp1Eqo5RsdctUm5XTmj9E8-dD2APCn89peL_anskrG7UrNXVcOODCT_Skw7YgGt4eoAwpfPSoKtQF8fyfmEbpDGuSRN9CzPdW7OH3-Kl-rkagqBk-oY2DnJaQ",
    "e": "AQAB",
    "kid": "gnap-public-client",
    "qi": "fTyhRigvfKGGb4ok52bT2jVf5kPPuDkGoI40FfmDNxgF0qr0i5gVgHQJyxZUfemp15n331Iow5TTc4utBT4S19qm1_0nRVLI0fqgKEW67dxwDBxPAXbpyyPSQDSYIwwnlQKoZtDxuDXjEUoRaGwMl7jfLF0_WVNq5ur6RV0Un4U",
    "dp": "x_bQdoY2ACFD2O7s3VBZ92kIlCxZUnebN2W7JkWBslIBe8U6LuEaWaW91ROsNQSHqeP0oz-Au-WZGD3hdBO2W7JGdnqqFNWiBISdm6IIw0J_llpPutdh_SDLgDUk2vp-JBc4rjj1B9hbupHFmfXqDJ7sGLchwezOP0we5oJVMRs",
    "alg": "PS512",
    "dq": "czgS5qxzLpOaDrnkr_frSkDp9Vo-9GoFUz8So8sHacfIaeSF_MT5dIRLy_nbsokgfB7CcUm6lhxERp0MpgYz7NG4byhAxSHSUyjdmFG9pClLJh7DZsIZeu0kxau1nx3AzBnG-ANTm16W-7dgJQJ_iWBaBVSvE6lV5exMutmfmzk",
    "n": "gobawvl3Y-MRkyIp4LoPJUkxDih1-eTEgZRkOwj1qS4Urix16UPp0LraW6oGva1d7-_Jqt0GUjCM0p7V0Uq3X96T2Au_fnXiZ4BK5aFB9pUxL5eVD0KKuRyh5ImCQk1cuHwJ26xiTxoJZ-4nD2QMXrK19ZDJ5BL8q7xCrhssHrT24RXu-HF0DQBlIX5FJnoveQxqMcbU99hrXfTadjorGSo2XO_cnsfRGMcxdmVGZP5LwrPfUDlttzodiOxBggXVoO33_1JUdifKE77nctH-eWmZ6xMh4OuapmWZTIF1HPx3hS1DMdxiLcWoW5vDBZLg3Dcpaj00dCTcagmKBWoC9w"
}`,
			proof: 'httpsig',
			display: undefined,
			accessToken: `{
  "access": [ "foo", "bar", "baz" ]
}`,
			interactStart: [ 'redirect' ],
			interactFinish: true,
			user: undefined,
			subject: undefined,
			httpSigAlgorithm: undefined,
			digest: 'sha-512'
		};
	}
	
	componentDidMount = () => {
		document.title = "XYZ Client";
		
		this.loadPending();
	}
	
	newTransaction = (e) => {
		
		const data = {
			grant_endpoint: this.state.grantEndpoint,
			private_key: this.state.privateKey ? JSON.parse(this.state.privateKey) : undefined,
			proof: this.state.proof,
			display: this.state.display ? JSON.parse(this.state.display) : undefined,
			access_token: this.state.accessToken ? JSON.parse(this.state.accessToken) : undefined,
			interact_start: this.state.interactStart,
			interact_finish: this.state.interactFinish,
			user: this.state.user ? JSON.parse(this.state.user) : undefined,
			subject: this.state.subject ? JSON.parse(this.state.subject) : undefined,
			http_sig_algorithm: this.state.httpSigAlgorithm,
			digest: this.state.digest
		};

		console.log(data);
		
		http({
			method: 'POST',
			path: '/api/client/parameterized',
			entity: data
		}).done(response => {
			this.loadPending();
		});
	}
	
	clearInstanceIds = (e) => {
		http({
			method: 'DELETE',
			path: '/api/client/ids'
		}).done(response => {
			this.setState({
				instances: {}
			});
		});
	}
	
	getInstanceIds = () => {
		http({
			method: 'GET',
			path: '/api/client/ids'
		}).done(response => {
			this.setState({
				instances: response.entity
			});
		});
	}
	
	loadPending = () => {
		console.log('Getting pending transactions...');
		http({
			method: 'GET',
			path: '/api/client/pending'
		}).done(response => {
			this.setState({
				transactions: response.entity
			});
		});
		this.getInstanceIds();
	}
	
	cancel = (transactionId) => () => {
		http({
			method: 'DELETE',
			path: '/api/client/poll/' + encodeURIComponent(transactionId)
		}).done(response => {
			this.loadPending();
		});
	}

	poll = (transactionId) => () => {
		http({
			method: 'POST',
			path: '/api/client/poll/' + encodeURIComponent(transactionId)
		}).done(response => {
			this.loadPending();
		});
	}
	
	use = (transactionId, tokenId) => () => {
		if (tokenId) {
			http({
				method: 'POST',
				path: '/api/client/use/' + encodeURIComponent(transactionId) + '/' + encodeURIComponent(tokenId)
			}).done(response => {
				this.loadPending();
			});
		} else {
			http({
				method: 'POST',
				path: '/api/client/use/' + encodeURIComponent(transactionId)
			}).done(response => {
				this.loadPending();
			});
		}
	}
	
	setGrantEndpoint = (e) => {
		this.setState({
			grantEndpoint: e.target.value ? e.target.value : undefined
		});
	}

	setPrivateKey = (e) => {
		this.setState({
			privateKey: e.target.value ? e.target.value : undefined
		});
	}

	setProof = (e) => {
		this.setState({
			proof: e.target.value ? e.target.value : undefined
		});
	}

	setDisplay = (e) => {
		this.setState({
			display: e.target.value ? e.target.value : undefined
		});
	}

	setAccessToken = (e) => {
		this.setState({
			accessToken: e.target.value ? e.target.value : undefined
		});
	}

	setInteractStart = (e) => {
		var opts = [];

		for (let i = 0; i < event.target.options.length; i++) {
			if (event.target.options[i].selected) {
				opts.push(event.target.options[i].value);
			}
		}
	
		this.setState({
			interactStart: opts
		});
	}

	setInteractFinish = (e) => {
		this.setState({
			interactFinish: e.target.selected
		});
	}

	setUser = (e) => {
		this.setState({
			user: e.target.value ? e.target.value : undefined
		});
	}

	setSubject = (e) => {
		this.setState({
			subject: e.target.value ? e.target.value : undefined
		});
	}

	setHttpSigAlgorithm = (e) => {
		this.setState({
			httpSigAlgorithm: e.target.value ? e.target.value : undefined
		});
	}
	
	setDigest = (e) => {
		this.setState({
			digest: e.target.value ? e.target.value : undefined
		});
	}
	


	render() {
		
		const pending = this.state.transactions.map(
				transaction => (
					<PendingTransaction key={transaction.id} transaction={transaction} cancel={this.cancel} poll={this.poll} use={this.use} />
				)
			).reverse(); // newest first
	
		return (
			<Container>
				<Form>
					<FormGroup>
						<Label for="grantEndpoint">
							Grant Endpoint URL
						</Label>
						<Input
							id="grantEndpoint"
							name="grantEndpoint"
							placeholder=""
							type="url"
							value={this.state.grantEndpoint}
							onChange={this.setGrantEndpoint}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="privateKey">
							Private Signing Key (JWK Format)
						</Label>
						<Input
							id="privateKey"
							name="privateKey"
							placeholder=""
							type="textarea"
							value={this.state.privateKey}
							onChange={this.setPrivateKey}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="proof">
							Proof Method
						</Label>
						<Input
							id="proof"
							name="proof"
							placeholder=""
							type="select"
							value={this.state.proof}
							onChange={this.setProof}
						>
							<option>httpsig</option>
							<option>jwsd</option>
							<option>jws</option>
						</Input>
					</FormGroup>
					{ this.state.proof == 'httpsig' && 
					<FormGroup>
						<Label for="httpSigAlgorithm">
							HTTP Signature Algorithm
						</Label>
						<Input
							id="privateKey"
							name="privateKey"
							placeholder=""
							type="select"
							value={this.state.httpSigAlgorithm}
							onChange={this.setHttpSigAlgorithm}
						>
							<option value="">(Use JOSE Algorithm from Key)</option>
							<option>rsa-pss-sha512</option>
							<option>rsa-v1_5-sha256</option>
							<option>hmac-sha256</option>
							<option>ecdsa-p256-sha256</option>
						</Input>
					</FormGroup>
					}
					{ this.state.proof == 'httpsig' && 
					<FormGroup>
						<Label for="digest">
							HTTP Content Digest
						</Label>
						<Input
							id="privateKey"
							name="privateKey"
							placeholder=""
							type="select"
							value={this.state.digest}
							onChange={this.setDigest}
						>
							<option>sha-512</option>
							<option>sha-256</option>
						</Input>
					</FormGroup>
					}
					<FormGroup>
						<Label for="display">
							Client Display
						</Label>
						<Input
							id="display"
							name="display"
							placeholder=""
							type="textarea"
							value={this.state.display}
							onChange={this.setDisplay}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="accessToken">
							Access Token
						</Label>
						<Input
							id="accessToken"
							name="accesstoken"
							placeholder=""
							type="textarea"
							value={this.state.accessToken}
							onChange={this.setAccessToken}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="interactStart">
							Interaction Start Methods
						</Label>
						<Input
							id="interactStart"
							name="interactStart"
							placeholder=""
							type="select"
							multiple
							value={this.state.interactStart}
							onChange={this.setInteractStart}
						>
							<option>redirect</option>
							<option>user_code</option>
							<option>user_code_uri</option>
						</Input>
					</FormGroup>
					<FormGroup check>
						<Input
							id="interactFinish"
							name="interactFinish"
							placeholder=""
							type="checkbox"
							value={this.state.interactFinish}
							onChange={this.setInteractFinish}
						/>
						{' '}
						<Label for="interactFinish" check>
							Include Interaction Finish (redirect)
						</Label>
					</FormGroup>
					<FormGroup>
						<Label for="user">
							User information (provided)
						</Label>
						<Input
							id="user"
							name="user"
							placeholder=""
							type="textarea"
							value={this.state.user}
							onChange={this.setUser}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="subject">
							Subject Information Request
						</Label>
						<Input
							id="privateKey"
							name="privateKey"
							placeholder=""
							type="textarea"
							value={this.state.subject}
							onChange={this.setSubject}
						/>
					</FormGroup>
				</Form>
				<Button color="info" onClick={this.newTransaction}>New Request</Button>
				{' '}
				<Button color="danger" size="sm" onClick={this.clearInstanceIds}>Clear Instance Ids</Button>
				<Button color="primary" size="sm" onClick={this.loadPending}>Refresh</Button>
				{pending}
			</Container>
		);
	}
	
}

class InstanceBadge extends React.Component{
	render() {
		if (this.props.instance) {
			return (<Badge title={this.props.instance}><FaClone/></Badge>);
		} else {
			return null;
		}
	}
}

class PendingTransaction extends React.Component{
	render() {
		const controls = [];
		
		return (
			<Card outline color="primary">
				<CardHeader>
					<Button color="info" onClick={this.props.poll(this.props.transaction.id)}>Poll</Button>
					<Button color="danger" onClick={this.props.cancel(this.props.transaction.id)}>Cancel</Button>
					<UseButtons transaction={this.props.transaction} use={this.props.use} />
				</CardHeader>
				<CardBody>
					<PendingTransactionEntry transaction={this.props.transaction} />
				</CardBody>
			</Card>
		);
	}
}

const UseButtons = ({...props}) => {

	if (props.transaction.access_token) {
		return (
			<Button color="success" onClick={props.use(props.transaction.id)}>Use</Button>
		);
	} else if (props.transaction.multiple_access_tokens) {
		const tokens = Object.keys(props.transaction.multiple_access_tokens)
		.filter(k => props.transaction.multiple_access_tokens[k])
		.map(k => (
			<Button key={k} color="success" onClick={props.use(props.transaction.id, k)}>Use {k}</Button>
		));
		
		return(
			<>
				{tokens}
			</>
		);
	} else {
		return null;
	}

}

class PendingTransactionEntry extends React.Component {
	render() {
		const elements = [];

		elements.push(
			...[
				<dt key="token-label" className="col-sm-3">Grant Endpoint</dt>,
				<dd key="token-value" className="col-sm-9">{this.props.transaction.grant_endpoint}</dd>
			]
		);
		
		if (this.props.transaction.access_token) {
			elements.push(
				...[
					<dt key="token-label" className="col-sm-3">Token</dt>,
					<dd key="token-value" className="col-sm-9"><AccessToken token={this.props.transaction.access_token} rs={this.props.transaction.rs_response} /></dd>
				]
			);
		}
		
		if (this.props.transaction.multiple_access_tokens) {
			const tokens = Object.keys(this.props.transaction.multiple_access_tokens)
			.filter(k => this.props.transaction.multiple_access_tokens[k])
			.map(k => (
				<span key={k}>
					<b>{k}</b>: <AccessToken token={this.props.transaction.multiple_access_tokens[k]} rs={this.props.transaction.multiple_rs_response ? this.props.transaction.multiple_rs_response[k] : null} />
					<br/>
				</span>
			));
			//debugger;
			elements.push(
				...[
					<dt key="multi-token-label" className="col-sm-3">Multiple Tokens</dt>,
					<dd key="multi-token-value" className="col-sm-9">{tokens}</dd>
				]
			);
		}

		if (this.props.transaction.continue_token) {
			elements.push(
				...[
					<dt key="continue-label" className="col-sm-3">Continuation Token</dt>,
					<dd key="continue-value" className="col-sm-9">{this.props.transaction.continue_token}</dd>
				]
			);
		}
		
		if (this.props.transaction.user_code) {
			elements.push(
				...[
					<dt key="code-url-label" className="col-sm-3">User Code URL</dt>,
					<dd key="code-url-value" className="col-sm-9"><a href={this.props.transaction.user_code_url}>{this.props.transaction.user_code_url}</a></dd>,
					<dt key="code-label" className="col-sm-3">User Code</dt>,
					<dd key="code-value" className="col-sm-9"><UserCode userCode={this.props.transaction.user_code} /></dd>
				]
			);
		}
		if (this.props.transaction.interaction_url) {
			elements.push(
				...[
					<dt key="interaction-label" className="col-sm-3">Interaction URL</dt>,
					<dd key="interaction-value" className="col-sm-9"><a href={this.props.transaction.interaction_url}>{this.props.transaction.interaction_url}</a></dd>
				]
			);
		}
		
		if (this.props.transaction.interaction_url && this.props.transaction.user_code) {
			elements.push(
				...[
					<dt key="qr-label" className="col-sm-3">Scannable Interaction URL</dt>,
					<dd key="qr-value" className="col-sm-9"><QRCode value={this.props.transaction.interaction_url} /></dd>
				]
			);
		}
		
		return (
			<Card body className={this.props.last ? null : "bg-light text-muted"}>
				<dl className="row">
					{elements}
				</dl>
			</Card>
		);		
	}
}

class AccessToken extends React.Component {
	render() {
		
		if (this.props.token) {
			if (this.props.rs) {
				return (
					<>
						<Badge color="info" pill>{this.props.token}</Badge>
						<code>{this.props.rs}</code>
					</>
				);
			} else {
				return (
					<Badge color="info" pill>{this.props.token}</Badge>
				);
			}
		} else {
			return null;
		}
		
	}
}

class UserCode extends React.Component {
	render() {
		
		if (this.props.userCode) {
			return (
				<Badge color="info" pill>{this.props.userCode.slice(0, 4)} - {this.props.userCode.slice(4)}</Badge>
			);
		} else {
			return null;
		}
		
	}
}





export default Client;
