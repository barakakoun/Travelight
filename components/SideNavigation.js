
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    Image,
} from 'react-native';
// import React, { Component, PropTypes, View, Text, Image } from 'react-native';

import { Avatar, Drawer, Divider, COLOR, TYPO, PRIMARY_COLORS } from 'react-native-material-design';

export default class SideNavigation extends Component {

    // static contextTypes = {
    //     drawer: PropTypes.object.isRequired,
    //     navigator: PropTypes.object.isRequired
    // };

    constructor(props) {
        super(props);
        this.state = {
            route: null
        }
    }

    // changeScene = (path, name) => {
    //     const { drawer, navigator } = this.context;
    //
    //     this.setState({
    //         route: path
    //     });
    //     navigator.to(path, name);
    //     drawer.closeDrawer();
    // };
    // changeScene = (id) => {
    //     // this.props.navigator.push({
    //     //     id: id,
    //     // });
    //     this.props.navigator.push({
    //         id: 'TourDetailsPage',
    //         chosenTour: {
    //             tour: {
    //                 key: 3,
    //                 coordinate: {
    //                     latitude: 300
    //                 }
    //             }
    //         },
    //         configureScene: Navigator.SceneConfigs.FloatFromBottom
    //     });
    // };
    //
    // //////////////////////////// importantttttttttttttttttttttttttttttttttt!!!!!!!!!!!!!! use this!
    // onPress(id) {
    //     this.props.navigator.push({
    //         id: id,
    //     });
    // }

    render() {
        const { route } = this.state;

        return (
            <Drawer theme='light'>
                <Drawer.Header backgroundColor='#4286f5' height={100}>
                    <View style={styles.header}>
                        <Avatar size={60} image={<Image source={require('../assets/baraklogo.png')}/>} />
                        <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>Kanye West</Text>
                    </View>
                </Drawer.Header>

                <Drawer.Section
                    items={[{
                        icon: 'face',
                        value: 'User',
                        // active: !route || route === 'welcome',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Components"
                    items={[{
                        icon: 'thumb-up',
                        value: 'Recommended',
                        active: route === 'avatars',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }, {
                        icon: 'event',
                        value: 'Events',
                        active: route === 'buttons',
                        // label: '8',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }, {
                        icon: 'label',
                        // value: 'Icon Toggles',
                        value: 'barak',
                        // label: 'NEW',
                        active: route === 'icon-toggles',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Config"
                    items={[{
                        icon: 'settings',
                        value: 'Settings',
                        // label: '10',
                        active: route === 'checkboxes',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }, {
                        icon: 'import-contacts',
                        value: 'About',
                        // label: '10',
                        active: route === 'dividers',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    },{
                        icon: 'invert-colors',
                        // value: 'Change Theme',
                        value: 'barak',
                        // label: '24',
                        active: route === 'themes',
                        // onPress: this.props.onChangeScene.bind(this, "navigatorName..."),
                        // onLongPress: this.props.onChangeScene.bind(this, "navigatorName...")
                    }]}
                />

            </Drawer>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 0
    },
    barak: {
        backgroundColor: '#e9eaed'
    }
};