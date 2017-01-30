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

class Items extends Component {
	getUrl(images) {
		var selectedMax = Infinity;
		var selected = null;
		let x
		for (x in images) {
			if (images[x].width < selectedMax) {
				selected = images[x];
				selectedMax = images[x].width;
			}
		}
		return selected.url;
	}
	render() {
		return(
			 <div className="container">
			      <div className="col-xs-12 col-sm-8 col-sm-offset-2">
			        <ul className="results">
			          
				        {
				          	this.props.items.map((item, i) => {
				          		var artwork = require('./no-image.png');
				          		if (item.images) {
				          			if (item.images.length > 0)
				          				artwork=this.getUrl(item.images)
				          		}
				          		else {
				          			if (item.album && item.album.images.length > 0)
					          			artwork=this.getUrl(item.album.images)
				          		}
						    	return <li key={i}><img alt="noimg" className="thumb" height="64" width="64" src={artwork}/>({item.type}){item.name}</li>
							})
					    }
			        </ul>
			      </div>
		    </div>
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
		            {this.props.errorVisible && <p className="error">Please fill out the form.</p>}
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
			data: [],
			errorVisible: false,
		}
	}
	searchQuery(e) {
		e.preventDefault()
		if (!e.target.querySearch.value) {
			this.setState({errorVisible: true})
			return
		}
		fetch('http://localhost:3001/search/'+ this.state.filterValue + '?query='+ e.target.querySearch.value, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				
			},
		}).then(response => response.json())
		.then(json => {

        	this.setState({
        		data: json.items,
        		errorVisible: false,
   			});
		});
	}
	filterClick(val, name) {

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
				<Search errorVisible={this.state.errorVisible} filter={this.state.filterValue} onSubmit={(e) => this.searchQuery(e)}/>
				<Items items={this.state.data}/>
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
