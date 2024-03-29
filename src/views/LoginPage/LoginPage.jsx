import React, { PureComponent } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";
type Props = {
  history: any
};
class LoginPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: "",
      password: ""
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  render() {
    const responseGoogle = response => {
      // var profile = response.getBasicProfile();
      // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
      // console.log('Full Name: ' + profile.getName());
      // console.log('Given Name: ' + profile.getGivenName());
      // console.log('Family Name: ' + profile.getFamilyName());
      // console.log("Image URL: " + profile.getImageUrl());
      // console.log("Email: " + profile.getEmail());

      // // The ID token you need to pass to your backend:
      // var id_token = response.getAuthResponse().id_token;
      // console.log("ID Token: " + id_token);
      console.log(response);
    };
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Open Hackathon"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                      {/* <div className={classes.socialLine}>
                        
                        <GoogleLogin
                          clientId="579245443763-iu7neoh0t6pv3bni5ll7gvh6v24ngtrr.apps.googleusercontent.com"
                          buttonText="Sign In with Google"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          cookiePolicy={'single_host_origin'}
                        />
                      </div> */}
                    </CardHeader>
                    {/* <p className={classes.divider}>Or</p> */}
                    <CardBody>
                      <CustomInput
                        labelText="Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handlesOnEmailChange,
                          type: "email",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handlesOnPasswordChange,
                          type: "password",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={this.handlesOnLogin}
                        // component={Link} to="/index"
                      >
                        Get started
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
      </div>
    );
  }

  handlesOnLogin = (event: SyntheticEvent<>) => {
    const { history } = this.props;
    const { email, password } = this.state;
    // Post request to backend
    fetch("http://openhackathon.us-east-1.elasticbeanstalk.com/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log("json", json);
        if (json.status != "BadRequest") {
          localStorage.setItem("userId", json.id);
          localStorage.setItem("role", json.role);
          localStorage.setItem(
            "accessToken",
            json.tokenType + " " + json.accessToken
          );
          localStorage.setItem("username", json.lastname);
          localStorage.setItem("firstname", json.firstname);
          window.location.href = "/index";
          // history.push({ pathname: "/index" });
        } else {
          alert("Invalid username or password!");
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
        }
      })
      .catch(() => {
        alert("Invalid username or password!");
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      });
  };
  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      //event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ password: event.target.value.trim() });
    }
  };

  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      //event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() });
    }
  };
}

export default withStyles(loginPageStyle)(LoginPage);
