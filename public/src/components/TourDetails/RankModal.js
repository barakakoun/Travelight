import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Image,
    Dimensions,
    Button,
} from 'react-native';
import {observer} from 'mobx-react/native';
import {observable} from 'mobx';
import { Divider, Subheader } from 'react-native-material-design';
import Stars from 'react-native-stars-rating';
const { width } = Dimensions.get('window');


@observer
class RankModal extends Component {
    @observable text = '';
    @observable isText = false;
    @observable userTourRate = 0;

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

    submitRate() {
        // TODO: call function(tourKeyForRanking, this.userTourRate, this.text)
        this.props.store.addRank(this.userTourRate, this.text);
        this.refs.modalRank.close();
    }

    onStarRatingPress(ranking) {
        this.isText = true;
        this.userTourRate = ranking;
    }


    render() {

        const {tourKeyForRanking} = this.props.store;
        if (!tourKeyForRanking) {
            return null;
        }

        return (
            <Modal style={[styles.modal, styles.modalRank]} backdrop={true}  backButtonClose={true} swipeToClose={false} transparent={true}
                   backdropOpacity={0.5} onClosed={()=>this.closeModal()} ref="modalRank">
                    <Subheader
                        style={{fontSize: 30}}
                        text="Rate The Tour"
                        color="googleBlue"/>

                    <Divider />

                    <View style={{ alignItems: 'center', flex: 1, marginTop: .1 }}>
                        <Stars
                            isActive={true}
                            rateMax={5}
                            isHalfStarEnabled={true}
                            onStarPress={(rating) => this.onStarRatingPress(rating)}
                            rate={this.userTourRate}
                            size={55}
                        />

                        {/*<Text style={{padding: 10, fontSize: 42}}>*/}
                            {/*{this.text.split(' ').map((word) => word && '🍕').join(' ')}*/}
                        {/*</Text>*/}

                        <TextInput
                            style={{width:280, fontSize: 16}}
                            placeholder="Tell us what you think.."
                            onChangeText={(text) => this.text = text}
                            editable={this.isText}
                            multiline = {true}
                            numberOfLines = {4}
                        />
                    </View>
                <View>
                    <Button
                        style={{marginBottom:10}}
                        title="Submit"
                        color="#4285f4"
                        raised={true}
                        onPress={()=>this.submitRate()}/>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey"
    },
    modalRank:{
        height: 280,
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
        fontSize: 30,
    }
});
module.exports = RankModal;