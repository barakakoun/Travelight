import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {Avatar,Icon} from 'react-native-material-design';
import {Button} from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import {
    Text,
    StyleSheet,
    View,
    Image,
    Dimensions,
} from 'react-native';
import {observer} from 'mobx-react/native';
const { width } = Dimensions.get('window');
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

    loadAudioIcon() {
        const {chosenStation} = this.props.store;
         if(chosenStation.audio)
        {
            return (<Icon name="audiotrack" color="rgba(0,0,0,.9)" size={45}/>);
        }

    }

    loadInfoIcon() {
        const {chosenStation} = this.props.store;
        if(chosenStation.info)
        {
            return (<Icon name="info" style={styles.info} color="rgba(0,0,0,.9)" size={45}/>);
        }
    }

    render() {
        const {chosenStation} = this.props.store;
        if (!chosenStation) {
            return null;
        }

        //const url = 'http://lacavewebradio.chickenkiller.com:8000/stream.mp3';
        this.props.store.setAudio();
        return (
            <Modal style={[styles.modal, styles.modelStation]} backdrop={true}  backButtonClose={true} swipeToClose={false} transparent={true}
                   backdropOpacity={0.5} onClosed={()=>this.closeModal()} ref="modalStation">
                <View style={styles.container} >
                    {this.loadInfoIcon()}
                    <View style={styles.name}>
                        <Text style={styles.text}>{chosenStation.name}</Text>
                    </View>
                    <View style={styles.image}>
                        <Image style={styles.img}
                            resizeMode='stretch'
                            source={{uri: chosenStation.img.toString()}}
                        />
                    </View>
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
        justifyContent:'flex-start',
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