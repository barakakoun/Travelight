import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {Avatar, Divider, Icon} from 'react-native-material-design';
import {Button} from 'react-native-vector-icons/FontAwesome';
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

        return (
            <Modal style={styles.modal} backdrop={true}  backButtonClose={true} swipeToClose={false} transparent={true}
                   backdropOpacity={0.5} onClosed={()=>this.closeModal()} ref="modalStation">
                <View style={styles.container} >

                    <View style={[styles.name, {paddingLeft:rightForIcon, paddingRight:leftForText }]}>
                        <Text style={[styles.text, {}]}>{chosenStation.name}
                        </Text>
                        <TouchableOpacity style={{position: 'absolute', flex: 1, justifyContent: 'center', right: rightForIcon, backgroundColor: '#dae7fe', height: 60}}
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

                    {chosenStation.audio ?
                    <View style={styles.player}>
                        <Button name="reply" color="rgba(0,0,0,.9)" backgroundColor="#dae7fe" size={45} onPress={()=>{
                            this.props.store.stopAudio();
                            this.props.store.playAudio();
                        }}/>
                        <Button name="play" color="rgba(0,0,0,.9)" backgroundColor="#dae7fe" size={45} onPress={()=>{
                            this.props.store.playAudio();
                        }}/>
                        <Button name="pause" color="rgba(0,0,0,.9)" backgroundColor="#dae7fe" size={45} onPress={()=>{
                             this.props.store.pauseAudio();
                        }}/>
                        <Button name="stop" color="rgba(0,0,0,.9)" backgroundColor="#dae7fe" size={45} onPress={()=>{
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
        alignItems: 'center',
        borderRadius: 5,
        height: 400,
        width: 310,
        backgroundColor: "#dae7fe"
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