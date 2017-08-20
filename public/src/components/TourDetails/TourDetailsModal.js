import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {
    Text,
    Button,
    StyleSheet,
    Image,
    TouchableHighlight,
    View,
} from 'react-native';
import {observer} from 'mobx-react/native';
import ReviewsComponent from './ReviewsComponent.js';

@observer
class TourDetailsModal extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.refs.modalTourDetails) {
            this.refs.modalTourDetails.open();
        }
    }

    closeModal() {
        if (this.refs.modalTourDetails) {
            this.refs.modalTourDetails.close();
        }
    }

    render() {
        const {chosenTour} = this.props.store;
        if (!chosenTour) {
            return null;
        }
        return (
            <Modal style={[styles.modal, styles.modalTourDetails]} backdrop={false} backButtonClose={true}
                   position={"bottom"} ref="modalTourDetails"
                   onClosed={this.props.onModalTourDetailsClosed.bind(this)}>
                <TouchableHighlight underlayColor="#c6dafd" onPress={this.props.goToTourDetails.bind(this)}>
                    <View style={[styles.modal, styles.modal2]}>
                        <Image resizeMode='cover' style={styles.img} source={{uri:chosenTour.img}}/>
                        <Text style={styles.text}>
                            {"\n"}
                            {chosenTour.name}
                            {"\n"}
                            {"\n"}
                            </Text>
                        <ReviewsComponent style={{paddingLeft:5, marginTop:20}} store={this.props.store} textColor="black"/>
                    </View>
                </TouchableHighlight>


            </Modal>

        );

    }
}


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal2: {
        marginLeft: 10
    },
    modalTourDetails: {
        height: 250,
        backgroundColor: "#dae7fe",
        borderTopColor: "#4286f5",
        borderTopWidth: 6
    },
    text: {
        color: "black",
        fontSize: 14,
        paddingLeft: 5
    },
    img:{
        width: 300,
        height: 130,
        backgroundColor: "white",
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#4286f5'
    },
    // btn: {
    //     margin: 10,
    //     backgroundColor: "#3B5998",
    //     color: "white",
    //     padding: 10
    // },
});

module.exports = TourDetailsModal;