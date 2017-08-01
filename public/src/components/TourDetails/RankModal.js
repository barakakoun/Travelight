import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
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
class RankModal extends Component {

    constructor(props) {
        super(props);
    }
//tourKeyForRanking
    componentDidUpdate() {
        if (this.refs.modalRank) {
            this.refs.modalRank.open();
        }
    }

    closeModal() {
        if (this.refs.modalRank) {
            this.refs.modalRank.close();
            this.props.store.setRankModalOpen(false);
            this.props.store.onRankIconPress(null);
        }
    }

    render() {

        const {tourKeyForRanking} = this.props.store;
        if (!tourKeyForRanking) {
            return null;
        }

        return (
            <Modal style={[styles.modal, styles.modalRank]} backdrop={true}  backButtonClose={true} swipeToClose={false} transparent={true}
                   backdropOpacity={0.5} onClosed={()=>this.closeModal()} ref="modalRank">
                <View style={styles.container} >
                    <View style={styles.name}>
                        <Text style={styles.text}>{tourKeyForRanking}</Text>
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
    modalRank:{
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
module.exports = RankModal;