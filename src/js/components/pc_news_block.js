import React from 'react';
import {Card} from 'antd';
// import {Router, Route, Link, browserHistory} from 'react-router';   //改版之前这样用

import {BrowserRouter as Router, Route,Link} from 'react-router-dom'; //改版之后
export default class PCNewsBlock extends React.Component{
    constructor(){
        super();
        this.state = {
            news: ''
        };
    }
    componentWillMount(){
        let myFetchOptions = {
            method: 'GET'
        };
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type="+ this.props.type +"&count="+ this.props.count, myFetchOptions)
        .then(response => response.json())
        .then(json =>  this.setState({news: json}));
    };
    render(){
        const {news} = this.state;
        const newsList = news.length
            ? news.map((newsItem,index) => (
                <li key={index}>
                    <Link to={`details/${newsItem.uniquekey}`} target="_blank">
                        {newsItem.title}
                    </Link>
                </li>
            ))
            : '没有加载到任何新闻';
        return (
            <div class="topNewsList">
                <Card>
                    <Router>
                        <ul>
                            {newsList}
                        </ul>
                    </Router>
                </Card>
            </div>
        );
    };
}