import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Button,
} from 'react-native';
import {observer} from 'mobx-react/native';
import {observable} from 'mobx';
import Stars from 'react-native-stars-rating';
const { width } = Dimensions.get('window');


@observer
class ReviewsComponent extends Component {

    constructor(props) {
        super(props);
    }

    showReviews() {
        //this.props.store.appNavigator.pop();
        this.props.store.appNavigator.push({
            id: 'ReviewsPage',
        });
    }

    render() {

        const {chosenTour} = this.props.store;

        return (
            <View style={styles.twoSides}>
                <View style={styles.oneByOne}>
                    <Text style={{marginRight: 2, color:'white', paddingLeft: 2}}>
                    </Text>
                    <Stars
                        isActive={false}
                        rateMax={5}
                        isHalfStarEnabled={true}
                        onStarPress={(rating) => console.log(rating)}
                        rate={chosenTour.rating}
                        size={20}
                    />
                    <TouchableOpacity onPress={() => this.showReviews()}>
                        <Text style={{marginLeft: 10, color:this.props.textColor, fontWeight: 'bold' }}>
                            { chosenTour.reviews } reviews
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    oneByOne: {
        backgroundColor: 'transparent',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    twoSides: {
        backgroundColor: 'transparent',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    oneUnderOne: {
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});
module.exports = ReviewsComponent;