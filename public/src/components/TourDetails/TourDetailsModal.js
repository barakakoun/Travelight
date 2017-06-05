import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {
    Text,
    Button,
    StyleSheet,
    Image,
    View,
} from 'react-native';
import {observer} from 'mobx-react/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Avatar } from 'react-native-material-design';

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
        console.warn("Render Details modal");
        if (!chosenTour) {
            return null;
        }
        return (
            <Modal style={[styles.modal, styles.modalTourDetails]} backdrop={false} backButtonClose={true}
                   backdropOpacity={0.2} position={"bottom"} ref="modalTourDetails"
                   onClosed={this.props.onModalTourDetailsClosed.bind(this)}>
                    <Avatar size={150} image={<Image source={{uri:chosenTour.img}}/>} />
                    <Text style={[styles.text, {color: "white"}]}>{chosenTour.name}</Text>
                    <Button onPress={this.props.goToTourDetails.bind(this)} title="More Info" style={styles.btn}/>
            </Modal>
        );

    }
}


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTourDetails: {
        height: 250,
        backgroundColor: "#3B5998"
    },
    text: {
        color: "black",
        fontSize: 22
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10
    },
});

module.exports = TourDetailsModal;