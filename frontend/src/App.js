import {Layer, Map, Marker, Popup, Source} from "react-map-gl";
import React, {useEffect, useMemo, useState} from "react";
import {Room, Star} from '@material-ui/icons'
import axios from "axios";
import {format} from "timeago.js";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
    const myStorage = window.localStorage;
    const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(0);
    const [rating, setRating] = useState();
    const [viewState, setViewState] = React.useState({
        latitude: 48,
        longitude: 2,
        zoom: 4,
    });
    const [clicked,setClicked] = useState(false);
    useEffect(() => {
        const getPins = async () => {
            try {
                const response = await axios.get("/pins");
                setPins(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getPins();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewState({...viewState, latitude: lat, longitude: long})
    }
    const handleAddClick = (e) => {
        e.preventDefault();
        if(currentUser) {
            const long = e.lngLat.lng;
            const lat = e.lngLat.lat;
            setNewPlace({
                lat, long
            })
        }else {
            setClicked(true);
            setTimeout(()=>setClicked(false),2000);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            description,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        }

        try {
            const response = await axios.post("/pins", newPin);
            setPins([...pins, response.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    }
    const [showRegister,setShowRegister] = useState(false);
    const [showLogin,setShowLogin] = useState(false);
    const handleLogout = ()=>{
        myStorage.removeItem("user");
        setCurrentUser(null);
    }


    return (
        <div>
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100vw', height: '100vh', msTransitionDuration: 1000}}
                mapStyle="mapbox://styles/gguser/cl0qlt17n007f14mqncfibgvl"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX}
                onDblClick={(e) => handleAddClick(e)}
            >
                {pins.map((pin) => (
                    <>
                        <Marker
                            latitude={pin.lat} longitude={pin.long}
                            offset={[-viewState.zoom * 0.5, -viewState.zoom * 1.75]}>
                            <Room
                                style={{
                                    fontSize: viewState.zoom * 4,
                                    color: pin.username === currentUser ? 'tomato' : 'slateblue',
                                    cursor: "pointer"
                                }}
                                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}/>
                        </Marker>
                        {pin._id == currentPlaceId &&
                            <Popup longitude={pin.long} latitude={pin.lat}
                                   anchor="left"
                                   closeOnClick={false}
                                   closeButton={true}
                                   onClose={() => setCurrentPlaceId(null)}
                            >
                                <div className={'card'}>
                                    <label>Place</label>
                                    <h4 className={'place'}>{pin.title}</h4>
                                    <label>Review</label>
                                    <p className={'desc'}>{pin.description}</p>
                                    <label>Rating</label>
                                    <div className={'stars'}>
                                        {Array(pin.rating).fill(<Star className={'star'}/>)

                                        }

                                    </div>
                                    <label>Information</label>
                                    <span className={'username'}>Created by <b>{pin.username}</b></span>
                                    <span className={'date'}>{format(pin.createdAt)}</span>
                                </div>
                            </Popup>
                        }
                    </>
                ))}
                {(newPlace && currentUser) && (
                    <Popup longitude={newPlace.long} latitude={newPlace.lat}
                           anchor="left"
                           closeOnClick={false}
                           closeButton={true}
                           onClose={() => setNewPlace(null)}
                    >
                        <div className={'card'}>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <label>Place</label>
                                <input placeholder={'Enter a title'} onChange={(e) => setTitle(e.target.value)}/>
                                <label>Review</label>
                                <textarea placeholder={'Say something about this place'}
                                          onChange={(e) => setDescription(e.target.value)}/>
                                <label>Rating</label>
                                <div>
                                <select onChange={(e) => setRating(e.target.value)}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>

                                </select>
                                </div>
                                <div>
                                <button className={'submitButton'} style={{minWidth:210}}>Add pin</button>
                                </div>
                            </form>
                        </div>
                    </Popup>
                )}
            </Map>
            {currentUser ? (<button className={'button logout'} onClick={()=>handleLogout()}>Logout</button> )
                :
                (<div className={'container'}>
                    <button className={'button login'} onClick={()=>setShowLogin(true)}>Login</button>
                    <button className={'button register'} onClick={()=>setShowRegister(true)}>Register</button>
                </div>)

            }
            {showLogin && (<Login setShowLogin = {setShowLogin} myStorage = {myStorage} setCurrentUser={setCurrentUser}/>)}
            {showRegister && (<Register setShowRegister = {setShowRegister}/>)}
            {clicked && (<div className={'container1'}><h1 style={{color:"red",fontWeight:700}}>To add pins,please login or register.</h1></div>)}
        </div>
    );
}

export default App;
