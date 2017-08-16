import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {Avatar, Divider, Icon} from 'react-native-material-design';
import {Button} from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import {
    Text,
    StyleSheet,
    View,
    Image,
    Navigator,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {observer} from 'mobx-react/native';
const { width } = Dimensions.get('window');
import Swiper from 'react-native-swiper';

@observer
class StationModel extends Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.refs.modalStation) {
            this.refs.modalStation.open();
        }
    }

    closeModal() {
        if (this.refs.modalStation) {
            this.props.store.stopAudio();
            this.refs.modalStation.close();
            this.props.store.setStationModalOpen(false);
            this.props.store.onStationPress(null);
        }
    }

    // loadAudioIcon() {
    //     const {chosenStation} = this.props.store;
    //      if(chosenStation.audio)
    //     {
    //         return (<Icon name="audiotrack" color="rgba(0,0,0,.9)" size={45}/>);
    //     }
    //
    // }

    // loadInfoIcon() {
    //     const {chosenStation} = this.props.store;
    //     // if(chosenStation.info)
    //     if(true)
    //     {
    //         return (
    //             //<Icon.Button name="info-circle" backgroundColor="#3b5998" onPress={this.barakFunction}>
    //             //</Icon.Button>
    //             <Icon name="info" style={styles.info} color="rgba(0,0,0,.9)" size={45}/>
    //     );
    //     }
    // }

    stationInfo() {
        this.props.store.navigatorOpenStationDetails('StationDetailsPage', Navigator.SceneConfigs.FloatFromBottom);

    }

    render() {
        const {chosenStation} = this.props.store;
        const rightForIcon = ((width - 300)/2);
        const leftForText = ((width - 300)/2) + 40;

        if (!chosenStation) {
            return null;
        }

        //const url = 'http://lacavewebradio.chickenkiller.com:8000/stream.mp3';
        this.props.store.setAudio();
        return (
            <Modal style={[styles.modal, styles.modelStation]} backdrop={true}  backButtonClose={true} swipeToClose={false} transparent={true}
                   backdropOpacity={0.5} onClosed={()=>this.closeModal()} ref="modalStation">
                <View style={styles.container} >

                    <View style={[styles.name, {paddingLeft:rightForIcon, paddingRight:leftForText }]}>
                        <Text style={[styles.text, {}]}>{chosenStation.name}
                        </Text>

                        <TouchableOpacity style={{position: 'absolute', flex: 1, justifyContent: 'center', right: rightForIcon, backgroundColor: 'white', height: 60}}
                                          onPress={() => this.stationInfo()}>
                            <Icon name="info" color="rgba(0,0,0,.9)" size={40} />
                        </TouchableOpacity>

                    </View>
                    <Swiper style={{marginTop: 60, marginBottom: 10}}
                            height={280}
                            activeDot={<View style={{backgroundColor: 'white', width: 9, height: 9, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                            showsButtons={true}
                            nextButton={<Text style={{backgroundColor: 'white', fontSize: 38, color:'white'}}>›</Text>}
                            prevButton={<Text style={{backgroundColor: 'white', fontSize: 38, color:'white'}}>‹</Text>}
                            loop
                    >
                        {
                            chosenStation.img.map((image,index) => (
                                <View style={styles.slide} key={index}>
                                    <Image
                                        key={index}
                                        resizeMode='stretch'
                                        style={styles.image}
                                        source={{uri: image.toString()}}
                                    >

                                    </Image>

                                </View>
                            ))
                        }
                    </Swiper>

                    <Divider style={{ marginBottom: 10 }}/>
                    { /* <View style={styles.icons}>
                        {this.loadInfoIcon()}
                        {this.loadAudioIcon()}
                    </View> */ }
                    {chosenStation.audio ?
                    <View style={styles.player}>
                        <Button name="reply" color="rgba(0,0,0,.9)" backgroundColor="rgba(255,255,255,0.5)" size={45} onPress={()=>{
                            this.props.store.stopAudio();
                            this.props.store.playAudio();
                        }}/>
                        <Button name="play" color="rgba(0,0,0,.9)" backgroundColor="rgba(255,255,255,0.5)" size={45} onPress={()=>{
                            this.props.store.playAudio();
                        }}/>
                        <Button name="pause" color="rgba(0,0,0,.9)" backgroundColor="rgba(255,255,255,0.5)" size={45} onPress={()=>{
                             this.props.store.pauseAudio();
                        }}/>
                        <Button name="stop" color="rgba(0,0,0,.9)" backgroundColor="rgba(255,255,255,0.5)" size={45} onPress={()=>{
                              this.props.store.stopAudio();
                        }}/>
                    </View> : null
                    }
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modelStation:{
        height: 400,
        width: 300,
        backgroundColor: "rgba(255,255,255,1)"
    },
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image:{
        flex: 2,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    img:{
        width,
        flex:1
    },
    name:{
        flex: 1,
        height: 60,
        justifyContent:'center',
        alignItems:'center'
    },
    text: {
        color: "black",
        fontSize: 22,
    },
    info: {
        justifyContent:'flex-start',
    },
    player:{
        flex:1,
        alignItems:'flex-end',
        justifyContent:'center',
        flexDirection:'row'
    }
});
module.exports = StationModel;