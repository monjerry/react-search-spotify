import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';

class Header extends Component {

	
	render() {
		return (
			<nav className="navbar navbar-default">
			<div className="container-fluid">
				<div className="container">
					<div className="navbar-header">
					<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<div className="navbar-brand" href="#"><i className="fa fa-rebel" aria-hidden="true"></i></div>
					</div>
					<Filters resultsNumber={this.props.resultsNumber} selectedValue={this.props.selectedValue} onClick={(val, name) => this.props.onClick(val, name)}/>
				</div>
			</div>
			</nav>
		);
	}
}

class Filters extends Component {
	renderFilter(value, name) {
		return <Filter value={value} name={name} onClick={(val, name) => this.props.onClick(val, name)}/>
	}
	render() {
		return(
			<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul className="nav navbar-nav">
				<li className="dropdown active">
				<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.selectedValue} <span className="caret"></span></a>
				<ul className="dropdown-menu">
					{this.renderFilter('artist', 'Artist')}
					{this.renderFilter('playlist', 'Playlist')}
					{this.renderFilter('track', 'Track')}
					{this.renderFilter('album', 'Album')}
					{this.renderFilter('all', 'All')}
				</ul>
				</li>
			</ul>
			<ul className="nav navbar-nav navbar-right">
				<li className="counter">{this.props.resultsNumber}</li>
			</ul>
			</div>
			)
	}
}

class Filter extends Component {
	render() {
		return(
			<li><a onClick={() => this.props.onClick(this.props.value, this.props.name)}>{this.props.name}</a></li>
		)
	}
}

class Search extends Component {
	render() {
		return (
			<div className="container">
		      <form className="form-horizontal" onSubmit={(e) => this.props.onSubmit(e)}>
		        <div className="form-group form-group-lg">
		          <div className="col-xs-12 col-sm-8 col-sm-offset-2">
		            <input className="form-control" type="text" id="querySearch" placeholder="Search..." />
		            <a className="search-icon" href=""><i className="fa fa-search" aria-hidden="true"></i></a>
		            <p className="error">Please fill out the form.</p>
		          </div>
		        </div>
		      </form>
		    </div>
			)
	}
}

class Spotify extends Component {

	constructor(){
		super();
		this.state = {
			filterValue: 'all',
			filterName: 'All',
			data: []
		}
	}
	searchQuery(e) {
		fetch('http://localhost:3001/search/'+ this.state.filterValue + '?query='+ e.target.querySearch.value, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'Accept': 'application/json',
				
			},
		}).then (function (response) {
			console.log(response)
			return response.json()
		})
		.then(function (json) {
			console.log(json)
			this.setState({data: json})
			console.log(this.state)
		})
		.catch(function (error) {console.log(error)});
		e.preventDefault()
	}
	filterClick(val, name) {
		console.log(name);
		this.setState(
			{
				filterValue: val,
				filterName: name
			});
	}
	render() {
		return (
			<div>
				<Header resultsNumber={this.state.data.length}selectedValue={this.state.filterName} onClick={(val, name) => this.filterClick(val, name)}/>
				<Search filter={this.state.filterValue} onSubmit={(e) => this.searchQuery(e)}/>
			</div>
			)
	}
}
ReactDOM.render(
	<div>
	<Spotify/>
	</div>,
	document.getElementById('root')
);
