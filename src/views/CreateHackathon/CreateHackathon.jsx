import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import TextField from "@material-ui/core/TextField";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

import { GoogleLogin } from "react-google-login";
import ChipInput from "material-ui-chip-input";
import AutoComplete from "material-ui/AutoComplete";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";

import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import axios from "axios";

import MenuItem from "@material-ui/core/MenuItem";

const dashboardRoutes = [];

class CreateHackathon extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",

      sponsors_list: [],
      hackathon: {},
      changedHackathon: {
        eventName: "",
        startDate: "",
        endDate: "",
        description: "",
        fees: 0,
        judges: [],
        minTeamSize: 0,
        maxTeamSize: 0,
        discount: 0,
        sponsors: [],
        status: "0"
      },
      judgeList: [],
      sponsorList: [],
      judges_list: [],
      judgeName: [],
      sponsorName: [],
      hackathon_id: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
    this.postHackathon = this.postHackathon.bind(this);
    this.updateHackathon = this.updateHackathon.bind(this);
    this.handleChangeMultiple = this.handleChangeMultiple.bind(this);
    this.getStyles = this.getStyles.bind(this);
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    console.log("Params::: ", id);
    if (id) {
      this.setState({ hackathon_id: id }, () => {
        this.getHackathon();
      });
    }
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.getSponsors();
    this.getJudges();
  }

  getJudges() {
    try {
      const authHeader = localStorage.getItem("accessToken");
      var url = "http://openhackathon.us-east-1.elasticbeanstalk.com/user/list";
      fetch(url, { headers: { Authorization: authHeader } })
        .then(res => res.json())
        .then(json => {
          if (json.status != "BadRequest") {
            console.log("json", json);
            var judges = [];
            for (var i = 0; i < json.length; i++) {
              judges.push({
                firstname: json[i].firstname == null ? "" : json[i].firstname,
                lastname: json[i].lastname == null ? "" : json[i].lastname,
                id: json[i].id
              });
            }
            console.log(judges);

            this.setState({ judges_list: judges }, () => {
              console.log(this.state.judges_list);
            });
          } else {
            alert(json.message);
          }
        });
    } catch (error) {}
  }
  getSponsors() {
    try {
      const authHeader = localStorage.getItem("accessToken");
      var url =
        "http://openhackathon.us-east-1.elasticbeanstalk.com/organization";
      fetch(url, { headers: { Authorization: authHeader } })
        .then(res => res.json())
        .then(json => {
          if (json.status != "BadRequest") {
            console.log("json", json);
            var sponsors = [];
            for (var i = 0; i < json.length; i++) {
              sponsors.push({ name: json[i].name, id: json[i].id });
            }
            console.log(sponsors);

            this.setState({ sponsors_list: sponsors });
          } else {
            alert(json.message);
          }
        });
    } catch (error) {}
  }

  handleChange(evt) {
    var changedHackathon = this.state.changedHackathon;
    changedHackathon[evt.target.id] = evt.target.value;
    this.setState({ changedHackathon: changedHackathon });
  }

  cancelAction() {
    window.location.href = "/index";
  }
  handleChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    console.log([event.target.id]);
    var changedHackathon = this.state.changedHackathon;
    changedHackathon[event.target.id] = value;
    this.setState(
      {
        changedHackathon: changedHackathon
      },
      () => {
        console.log(this.state.judges);
      }
    );
  };

  getHackathon() {
    const authHeader = localStorage.getItem("accessToken");
    axios
      .get(
        "http://openhackathon.us-east-1.elasticbeanstalk.com/hackathon/" +
          this.state.hackathon_id,
        {
          params: {
            userId: localStorage.getItem("userId")
          },
          headers: { Authorization: authHeader }
        }
      )
      .then(response => {
        if (response.status != "BadRequest") {
          console.log("GET RESPONSE:::: ", response);
          var hackathon = {};
          var changedHackathon = {};

          hackathon.eventName = response.data.eventName;
          hackathon.description = response.data.description;
          hackathon.fees = response.data.fees;
          hackathon.startDate = response.data.startDate.substring(0, 10);
          hackathon.endDate = response.data.endDate.substring(0, 10);
          hackathon.minTeamSize = response.data.minTeamSize;
          hackathon.maxTeamSize = response.data.maxTeamSize;
          hackathon.sponsors = response.data.sponsors;
          hackathon.judges = response.data.judges;

          changedHackathon = hackathon;
          changedHackathon.sponsors = [];
          changedHackathon.judges = [];
          for (let i = 0; i < response.data.sponsors.length; i++) {
            changedHackathon.sponsors.push(response.data.sponsors[i].id);
          }

          for (let i = 0; i < response.data.judges.length; i++) {
            changedHackathon.judges.push(response.data.judges[i].userId);
          }
          this.setState({
            hackathon: hackathon,
            changedHackathon: changedHackathon
          });
        } else {
          alert(response.data.message);
        }
      });
  }
  postHackathon() {
    const authHeader = localStorage.getItem("accessToken");
    fetch("http://openhackathon.us-east-1.elasticbeanstalk.com/hackathon", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.changedHackathon)
    })
      .then(res => res.json())
      .then(json => {
        if (json.status != "BadRequest") {
          window.location.href = "/hackathon_details/" + json.id;
        } else alert("Request failed with error: " + json.message);
      });
  }

  updateHackathon() {
    const authHeader = localStorage.getItem("accessToken");
    console.log("Updating: ", this.state.changedHackathon);
    fetch(
      "http://openhackathon.us-east-1.elasticbeanstalk.com/hackathon/" +
        this.state.hackathon_id,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.changedHackathon)
      }
    )
      .then(res => res.json())
      .then(json => {
        if (json.status != "BadRequest") {
          window.location.href = "/hackathon_details/" + json.id;
        } else alert("Request failed with error: " + json.message);
      });
  }

  handleJudgesSelectChange = event => {
    var changedHackathon = this.state.changedHackathon;
    // this.setState({  });
    changedHackathon["judges"] = event.target.value;
    this.setState({
      judgeName: event.target.value,
      changedHackathon: changedHackathon
    });
  };

  handleSponsorSelectChange = event => {
    var changedHackathon = this.state.changedHackathon;
    // this.setState({});
    changedHackathon["sponsors"] = event.target.value;
    this.setState({
      sponsorName: event.target.value,
      changedHackathon: changedHackathon
    });
  };

  getStyles(name, that) {
    return {
      fontWeight: that.state.judgeName.indexOf(name) === -1 ? "1.2" : "1"
    };
  }
  render() {
    const styles = theme => ({
      root: {
        display: "flex",
        flexWrap: "wrap"
      },
      formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300
      },
      chips: {
        display: "flex",
        flexWrap: "wrap"
      },
      chip: {
        margin: theme.spacing.unit / 4
      },
      noLabel: {
        marginTop: theme.spacing.unit * 3
      }
    });
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }
      }
    };
    const { classes, ...rest } = this.props;
    // console.log("STATE::", this.state);
    var comp =
      this.state.hackathon_id == 0 ? (
        // <CardFooter className={classes.cardFooter}>
        <Button simple color="primary" size="lg" onClick={this.postHackathon}>
          Create
        </Button>
      ) : (
        // </CardFooter>
        // <CardFooter className={classes.cardFooter}>
        <Button simple color="primary" size="lg" onClick={this.updateHackathon}>
          Update
        </Button>
        // </CardFooter>
      );
    var title =
      this.state.hackathon_id == 0 ? "Create Hackathon" : "Update Hackathon";

    var sponsors = [];
    for (let i = 0; i < this.state.sponsors_list.length; i++) {
      if (
        this.state.changedHackathon.sponsors.includes(
          this.state.sponsors_list[i].id
        )
      ) {
        sponsors.push(
          <option
            key={this.state.sponsors_list[i].id}
            value={this.state.sponsors_list[i].id}
            selected
          >
            {this.state.sponsors_list[i].name}
          </option>
        );
      } else {
        sponsors.push(
          <option
            key={this.state.sponsors_list[i].id}
            value={this.state.sponsors_list[i].id}
          >
            {this.state.sponsors_list[i].name}
          </option>
        );
      }
    }

    var judges = [];
    for (let i = 0; i < this.state.judges_list.length; i++) {
      if (
        this.state.changedHackathon.judges.includes(
          this.state.judges_list[i].id
        )
      ) {
        judges.push(
          <option
            key={this.state.judges_list[i].id}
            value={this.state.judges_list[i].id}
            selected
          >
            {this.state.judges_list[i].firstname +
              " " +
              this.state.judges_list[i].lastname}
          </option>
        );
      } else {
        judges.push(
          <option
            key={this.state.judges_list[i].id}
            value={this.state.judges_list[i].id}
          >
            {this.state.judges_list[i].firstname +
              " " +
              this.state.judges_list[i].lastname}
          </option>
        );
      }
    }
    // console.log("Judges: ", this.state.judges_list);

    return (
      <div>
        <Header
          color="primary"
          routes={dashboardRoutes}
          brand="Open Hackathon"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
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
          <div className={classes.container} style={{ paddingTop: 100 }}>
            <h2>{title}</h2>
            <GridContainer xs={12} sm={12} md={12} justify="center">
              <GridItem xs={6} sm={6} md={6}>
                <Card
                  xs={6}
                  sm={6}
                  md={6}
                  className={classes[this.state.cardAnimaton]}
                >
                  <form className={classes.form}>
                    <CardBody style={{ height: "400px" }}>
                      <TextField
                        style={{ paddingLeft: 20, width: "300px" }}
                        // placeholder="Name"
                        id="eventName"
                        label="Hackathon Name"
                        value={this.state.changedHackathon.eventName}
                        type="text"
                        className={classes.textField}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        // variant="outlined"
                      />
                      <br />
                      {/* <InputLabel htmlFor="description">Description</InputLabel> */}
                      <TextField
                        style={{ paddingLeft: 20, width: "300px" }}
                        id="description"
                        label="Description"
                        value={this.state.changedHackathon.description}
                        type="text"
                        className={classes.textField}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        // variant="outlined"
                      />
                      <br />
                      {/* <InputLabel htmlFor="judges">Judges</InputLabel>
                      <Select
                        style={{ padding: "10px" }}
                        label="Judges Multiple select"
                        id="judges"
                        multiple
                        native
                        onChange={this.handleChangeMultiple}
                        inputProps={{
                          name: "Judges",
                          id: "judges"
                        }}
                      >
                        {judges}
                      </Select> */}
                      <FormControl
                        className={classes.formControl}
                        style={{ padding: "20px" }}
                      >
                        <InputLabel htmlFor="select-multiple">
                          Judges
                        </InputLabel>
                        <Select
                          multiple
                          autoWidth="true"
                          style={{
                            width: "300px"
                          }}
                          value={this.state.judgeName}
                          onChange={this.handleJudgesSelectChange}
                          input={<Input id="select-multiple" />}
                          MenuProps={MenuProps}
                        >
                          <MenuItem disabled value="">
                            <em>Multiple select</em>
                          </MenuItem>
                          {this.state.judges_list.map(judge => (
                            <MenuItem
                              key={judge.id}
                              value={judge.id}
                              style={this.getStyles(judge.firstname, this)}
                            >
                              {judge.firstname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* <Select
                        multiple
                        native
                        onChange={this.handleChangeMultiple}
                        inputProps={{
                          id: "sponsors"
                        }}
                      >
                        {sponsors}
                      </Select> */}
                      <br />
                      <FormControl
                        className={classes.formControl}
                        style={{ padding: "20px" }}
                      >
                        <InputLabel htmlFor="select-multiple">
                          Sponsors
                        </InputLabel>
                        <Select
                          multiple
                          value={this.state.sponsorName}
                          style={{
                            width: "300px"
                          }}
                          onChange={this.handleSponsorSelectChange}
                          input={<Input id="select-multiple" />}
                          MenuProps={MenuProps}
                        >
                          <MenuItem disabled value="">
                            <em>Multiple select</em>
                          </MenuItem>
                          {this.state.sponsors_list.map(sponsor => (
                            <MenuItem
                              key={sponsor.id}
                              value={sponsor.id}
                              style={this.getStyles(sponsor.name, this)}
                            >
                              {sponsor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <br />
                    </CardBody>
                  </form>
                </Card>
              </GridItem>
              <GridItem xs={6} sm={6} md={6}>
                <Card
                  xs={6}
                  sm={6}
                  md={6}
                  className={classes[this.state.cardAnimaton]}
                  style={{ height: "400px" }}
                >
                  <form className={classes.form}>
                    <CardBody>
                      <TextField
                        id="fees"
                        label="Fees ($)"
                        type="number"
                        value={this.state.changedHackathon.fees}
                        className={classes.textField}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        // variant="outlined"
                      />
                      <TextField
                        style={{ marginLeft: 10 }}
                        id="discount"
                        label="Discount %"
                        type="number"
                        value={this.state.changedHackathon.discount}
                        className={classes.textField}
                        onChange={this.handleChange}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        // variant="outlined"
                      />
                      <br />
                      <TextField
                        id="startDate"
                        label="Start Date"
                        value={this.state.changedHackathon.startDate}
                        className={classes.textField}
                        margin="normal"
                        // variant="outlined"
                        type="date"
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <TextField
                        style={{ marginLeft: 10 }}
                        id="endDate"
                        label="End Date"
                        value={this.state.changedHackathon.endDate}
                        className={classes.textField}
                        margin="normal"
                        // variant="outlined"
                        type="date"
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <br />
                      <TextField
                        id="minTeamSize"
                        label="Min Team Size"
                        value={this.state.changedHackathon.minTeamSize}
                        type="number"
                        className={classes.textField}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        onChange={this.handleChange}
                        // variant="outlined"
                      />
                      <TextField
                        style={{ marginLeft: 10 }}
                        id="maxTeamSize"
                        label="Max Team Size"
                        value={this.state.changedHackathon.maxTeamSize}
                        type="number"
                        className={classes.textField}
                        // inputProps={{
                        //   onChange: this.handleChange
                        // }}
                        onChange={this.handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                        // variant="outlined"
                      />
                    </CardBody>
                    {comp}
                    {/* <CardFooter className={classes.cardFooter}> */}
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      onClick={this.cancelAction}
                    >
                      Cancel
                    </Button>
                    {/* </CardFooter> */}
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
            {/* <GridContainer xs={12} sm={12} md={12} justify="center">
              <GridItem xs={6} sm={6} md={6}>
                <Card
                  xs={6}
                  sm={6}
                  md={6}
                  className={classes[this.state.cardAnimaton]}
                >
                  <CardBody>
                    <h3>Judges selected</h3>
                    {this.state.judgeName.map(judge => (
                      <h5
                        key={judge}
                        // value={sponsor.name}
                        // style={this.getStyles(sponsor.name, this)}
                      >
                        {judge}
                      </h5>
                    ))}
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={6} sm={6} md={6}>
                <Card
                  xs={6}
                  sm={6}
                  md={6}
                  className={classes[this.state.cardAnimaton]}
                >
                  <CardBody>
                    <h3>Sponsors selected</h3>
                    {this.state.sponsorName.map(sponsor => (
                      <h5
                        key={sponsor}
                        // value={sponsor.name}
                        // style={this.getStyles(sponsor.name, this)}
                      >
                        {sponsor}
                      </h5>
                    ))}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(CreateHackathon);
