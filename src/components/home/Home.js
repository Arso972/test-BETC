/* eslint-disable no-unused-expressions */
import React, { Component, Fragment } from 'react';
import './meteo.scss';
import './select.scss';
import Axios from 'axios';
import Card from '../card/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'


class Home extends Component{

    state = {
        villes:[
            {
                title:"PARIS",
                urlApi:"https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=e42ca4b5c4de5ce5717d9e5bb5c1dc8f"
            },
            {
                title:"LONDON",
                urlApi:"https://api.openweathermap.org/data/2.5/weather?q=London&appid=e42ca4b5c4de5ce5717d9e5bb5c1dc8f"
            },
            {
                title:"BANGKOK",
                urlApi:"https://api.openweathermap.org/data/2.5/weather?q=Bangkok&appid=e42ca4b5c4de5ce5717d9e5bb5c1dc8f"
            }
        ],
        defaultVille:"PARIS",
        dataVille:null,
        select:false
    };

    dataMeteo = (defaultVile)=>{

        let urlApi ;
        
        // Recuperation de l'ID et de l'url API de la ville par default
        this.state.villes.map((ville, id)=>{
            if(defaultVile === ville.title){
                urlApi = ville.urlApi;
            } 
            return null
        })

        // Recuperation des données
        Axios.get(urlApi)
        .then(res =>{
            console.log('axios res.data : ', res.data)
            this.setState({dataVille:  res.data})
        })
        .catch(err =>{
            console.log("Error : ", err)
        })
    }

    handleChange = (data) => {
        //Changement de ville apres choix du select
        this.setState({defaultVille: data , select : false}, ()=>{
            this.dataMeteo(this.state.defaultVille)
        });
    }

    openSelect = () =>{
        let active;
        //Toggle select
        this.state.select ? active = false : active = true ;

        this.setState({select : active })
    }


    componentDidMount (){
        //Chargement des data de la ville par defaut
        this.dataMeteo(this.state.defaultVille)

        let myThis = this ;

        //Refresh des data toutes les 1H
        setInterval(function(){ 
            myThis.dataMeteo(myThis.state.defaultVille)
        }, 3600000);
    }

    render(){
        if( this.state.dataVille === null){
            return (
                <Fragment>
                    <h1>Merci de patienter..</h1>
                </Fragment>
              );
          }else{
            return (
                <div className={ this.state.dataVille.clouds.all > 30 ? "meteo rain" : "meteo sun"}>
                    <div className="meteo__position">
                        <h3 className="meteo__position_title">Météo</h3>
                        <p className="meteo__position_data">( { this.state.dataVille.coord.lon.toString().replace('.', ',') + " ; " + this.state.dataVille.coord.lat.toString().replace('.', ',')  } )</p>
                    </div>
                    <div className="meteo__content">
                      <h1 className="meteo__content_title">{this.state.dataVille.name}</h1>
                      <h2 className="meteo__content_subtitle">{  Math.round( this.state.dataVille.main.temp - 273.15 ) }°C</h2>
                    </div>
                    <div className="meteo__card">
                        < Card  
                            title="Pression" 
                            data={ this.state.dataVille.main.pressure  } 
                            unity="hPa" 
                            icon={require("../../img/icons/fleche.svg")} 
                        />
                        < Card 
                            title="Vitesse des rafales de vent" 
                            data={ Math.round( this.state.dataVille.wind.speed * 3.6 )  } 
                            unity="km/h" 
                            icon={require("../../img/icons/fleche-fleche.svg")} 
                        />
                        < Card 
                            title="Risque de précipitation <br />( Humidité )" 
                            data={ this.state.dataVille.main.humidity  } 
                            unity="%" 
                            icon={require("../../img/icons/pluie.svg")} 
                        />
                        < Card 
                            title="Nébulosité" 
                            data={ this.state.dataVille.clouds.all  } 
                            unity="%" 
                            icon={require("../../img/icons/pluie-fleche.svg")} 
                        />
                    </div>
                    <div className="select">
                        <h3 className={ this.state.select ? "select__title active" : "select__title"} onClick={this.openSelect}>{this.state.defaultVille}<FontAwesomeIcon icon={faChevronDown} className={ this.state.select ? "active" : ""}/></h3>
                        <ul className={ this.state.select ? "select__list active" : "select__list" }>
                            {
                                this.state.villes.map((ville, id)=>{
                                    return( <li key={"list--"+id} className="select__list_item" onClick={()=>{this.handleChange(ville.title)}}>{ville.title}</li> )
                                })
                            }
                        </ul>
                    </div>
                </div>
              );
          }
        
        
    }
}

export default Home;