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

} from 'react-native';
import {observer} from 'mobx-react/native';

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
            this.props.store.releaseAudio();
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
            return (<Icon name="info" color="rgba(0,0,0,.9)" size={45}/>);
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
            <Modal style={[styles.modal, styles.modelStation]} backdrop={false}  backButtonClose={true} transparent={true}
                   backdropOpacity={0.2} onClosed={()=>this.closeModal()} ref="modalStation">
                <View style={styles.container} >
                    <View style={styles.name}>
                        <Text style={styles.text}>{chosenStation.name}</Text>
                    </View>
                    <View style={styles.image}>
                        <Avatar size={90} image={<Image source={{uri:chosenStation.img}}/>} />
                    </View>
                    <View style={styles.icons}>
                        {this.loadInfoIcon()}
                        {this.loadAudioIcon()}
                    </View>
                    <View style={styles.player}>
                        <Button name="reply" color="rgba(0,0,0,.9)" backgroundColor="rgba(255,255,255,0.5)" size={45} onPress={()=>{
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
                    </View>
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
        height: 300,
        backgroundColor: "rgba(255,255,255,0.5)"
    },
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    image:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    name:{
            flex: 1,
            justifyContent:'center',
            alignItems:'flex-start'
    },
    text:{
        color: "black",
        fontSize: 22,
    },
    icons:{
        flex:1,
        justifyContent:'space-between',
        flexDirection: 'row',
        alignItems:'flex-end'

},
    player:{
        flex:1,
        alignItems:'flex-end',
        justifyContent:'space-between',
        flexDirection:'row'
    }
});
module.exports = StationModel;