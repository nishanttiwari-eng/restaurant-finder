import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      data: null,
      // fetching: false,
    };
  }
  position = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      console.log("position is", position.coords);
      this.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  };
  fetchList = () => {
    const key = "968df983b0ef7fde8b87d81254b9beaa";
    const { lat, lon } = this.state;
    fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`, {
      method: "GET",
      headers: {
        "user-key": key,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          data: data.nearby_restaurants,
          fetching: false,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({
          fetching: false,
        });
      });
  };
  render() {
    const { data, lat, lon, fetching } = this.state;
    return (
      <div className="App">
        <h1>Restaurant Finder</h1>
        <button onClick={this.position}>GET LOCATION</button>
        {lat !== null && lon !== null ? <button onClick={this.fetchList}>FETCH LIST</button> : null}
        {fetching && <h1>Loading...</h1>}
        {data && data.map((item) => this.renderItem(item))}
      </div>
    );
  }
  renderItem = (item) => {
    const { id } = item;
    const api = `https://developers.zomato.com/api/v2.1/reviews?res_id=${id}`
    return (
      <div>
        <a href={item.restaurant.url}>{item.restaurant.name}</a>
        <br />
      </div>
    );
  };
}

export default App;
