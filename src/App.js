import './App.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faMinus, faRepeat, faHeart, faVolumeUp, faPlay, faPause} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

class MusicplayerApp extends React.Component {
  constructor(){
    super();
    this.state = {
      volume: 0.2,
      playIcon: faPlay,
      currenttimeofsong: '00:00',
      endtimeofsong: '00:00',
      playnow: true,
      showvolume: true,
      fontawesomeplayandpausestyle: {
        color: "#72646f",
        fontSize: "1.8em",
        cursor: "pointer",
      },
      showmediaplayer: false,
      mp3test: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
      changebarwidth: '',
      hideloginbutton: true,
      storetoken: localStorage.getItem("token"),
    }
    this.audioRef = React.createRef();
  }
  
  componentDidMount () {
    let getLocalstorage = localStorage.getItem('token');
    let getSpotifytoken = window.location.hash; 
    if(!getLocalstorage && getSpotifytoken) {
      getLocalstorage = getSpotifytoken.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = '';
      window.localStorage.setItem("token", getLocalstorage)
    } 
    this.setState({
      storetoken: getLocalstorage,
    })
    this.getSpotifymusic();
  
  }

  /*
  step 1: check if the localstorage isn't empty and check if the hash empty
  step 2: 
  step 3: if the two condition met perform the 
  step 4: when the page is loaded the state is still the same and that means its empty
  step 5: find a way to get the localstorage when the page loads again
  */

 

 getSpotifymusic = async () => {
  //console.log(this.state.storetoken)
    try {
      let response = await axios.post('https://api.spotify.com/v1/me/player', {
        params: { limit: 50, offset: 0 } ,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer  ${this.state.storetoken}`,
          'Content-Type': 'application/json',
        },
      })
      console.log(response);
    } catch (error) {
      console.log(error)
    }

  }

  changeVolume = (e) => {
    this.setState({
      volume: Math.round(Number(e.target.value) / 100 * 10) / 10},()=>{
        let dynamicvolume = this.audioRef.current;
        dynamicvolume.volume = this.state.volume;
   })
  };

  volumeDown = () => {
    this.setState({
      volume: Math.round(Math.max(0, this.state.volume - 0.2) * 10) / 10},()=>{
        let downvolume =  this.audioRef.current;
        downvolume.volume = this.state.volume;
   })
  }

  volumeUp = () => {
    this.setState({
      volume: Math.round(Math.min(1, this.state.volume + 0.2) * 10) / 10},()=>{
      let upvolume = this.audioRef.current;
      upvolume.volume = this.state.volume;
   })
  }

  playDeezermusic = () => {
    let secDuration = this.audioRef.current.duration;
    let minDuration;
    //Toggle/
    this.setState(prevState => ({
      playnow: !prevState.playnow
    }));
    // Change Fontawesome Icon 
    this.state.playnow ? this.setState({playIcon: faPause,}, () => {}): this.setState({playIcon: faPlay,}, () => {});
    this.state.playnow ? this.audioRef.current.play() : this.audioRef.current.pause();
    //convert duration of the song to min and seconds/
    secDuration = Math.floor(secDuration);    
    minDuration = Math.floor( secDuration / 60 );
    minDuration = minDuration >= 10 ? minDuration : '0' + minDuration;    
    secDuration = Math.floor( secDuration % 60 );
    secDuration = secDuration >= 10 ? secDuration : '0' + secDuration;
    this.setState({
      endtimeofsong: minDuration + ':' + secDuration
    })
  }
  
  updateTime = () => {
   let minutesCur = Math.floor(this.audioRef.current.currentTime/ 60);
   let secsCur = Math.floor(this.audioRef.current.currentTime % 60);
   minutesCur = minutesCur < 10 ? "0" + minutesCur : minutesCur;
   secsCur = secsCur < 10 ? "0" + secsCur : secsCur;
   this.setState({
    currenttimeofsong: minutesCur + ":" + secsCur,
   })
   this.setState({
    changebarwidth: (100 * this.audioRef.current.currentTime)/this.audioRef.current.duration,
   })
  }

  hideandshowVolume = () =>  {
    this.setState(prevState => ({
      showvolume: !prevState.showvolume,
    }));
  }

  render() {
    return (
      <div className='App'>
       <div className='spotifyContainer' style={{display: this.state.hideloginbutton ? "flex" : "none"}}>
        <a href={`${process.env.REACT_APP_SPOTIFY_LINK}?client_id=${process.env.REACT_APP_SPOTIFY_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT}&response_type=${process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE }`} onClick={this.getSpotifymusic}><button>Spotify</button></a>

       </div>
      <div className='musicPlayerapp' style={{display: this.state.showmediaplayer ? "flex" : "none"}}>
        <div className='musicCover'>
          <img alt="albumcover" src={require('./media/theweeknd.jpeg')}/>  
        </div>
        <div className='displayTitle'>
         <span id="albumHeader">The weeknd after hours</span>
         <span id="songPlaying">Can't Feel My Face</span>
        </div>
        <div className='changeVolumecontainer' style={{visibility: this.state.showvolume ? "hidden" : "visible"}}>
        <FontAwesomeIcon icon={faMinus} id="volumeMinus" onClick={this.volumeDown}/>
        <div className='bar'>
        <input type="range" className="volumeChange" min="0" max="100" step="1" value={`${this.state.volume * 100}`} onChange={(e)=>{this.changeVolume(e)}} style={{backgroundSize: `${this.state.volume * 100}% 100%`}}/>
        </div>
        <FontAwesomeIcon icon={faPlus} id="volumePlus" onClick={this.volumeUp}/>
        </div>
        <div className='musicOptions'>
          <div><FontAwesomeIcon icon={faRepeat} id="repeatSong"/></div>
          <div><FontAwesomeIcon icon={faHeart} id="favoriteSong" /></div>
          <div><FontAwesomeIcon icon={faVolumeUp} id="showVolume" style={{color: this.state.showvolume ? "#72646f" : "#D64933"}} onClick={this.hideandshowVolume} /></div>
        </div>
        <div className="timescreenMusiccontainer">
          <div className='audioStarttime'>
            {this.state.currenttimeofsong}
          </div>
          <div className='audioTime'>
            <audio height="0" width="0" id="musicPlaying" controls="controls" alt="song not playing" onTimeUpdate={this.updateTime} ref={this.audioRef} src={this.state.mp3test}>
            </audio>
            <div className='audioBar' style={{width: `${this.state.changebarwidth}%`}}></div>
          </div>
          <div className='audioEndtime'>
            {this.state.endtimeofsong}
          </div>
        </div>
        <div className="playMusicconatiner">
          <div className='playOrpause'><FontAwesomeIcon icon={this.state.playIcon} style={this.state.fontawesomeplayandpausestyle} onClick={() => {this.playDeezermusic()}}/></div>
        </div>
      </div>
      </div>
    );
  }
}

export default MusicplayerApp;
