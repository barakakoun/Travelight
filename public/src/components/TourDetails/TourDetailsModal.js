import React, {Component} from 'react';
import Modal from 'react-native-modalbox';
import {
    Text,
    Button,
    StyleSheet,
} from 'react-native';

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
        if (this.props.chosenTour == null) {
            return null;
        }
        return (
            <Modal style={[styles.modal, styles.modalTourDetails]} backdrop={false} backButtonClose={true}
                   backdropOpacity={0.2} position={"bottom"} ref="modalTourDetails"
                   onClosed={this.props.onModalTourDetailsClosed.bind(this)}>
                <Text style={[styles.text, {color: "white"}]}>Tour key: {this.props.chosenTour.key.toString()}</Text>
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
        height: 150,
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