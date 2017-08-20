
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Navigator,
    Image,
    BackAndroid,
} from 'react-native';
// import React, { Component, PropTypes, View, Text, Image } from 'react-native';

import { Avatar,
        Drawer,
        Divider,
        COLOR,
        TYPO,
        PRIMARY_COLORS } from 'react-native-material-design';
import { observer } from 'mobx-react/native';

@observer
export default class SideNavigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            route: null
        }
    }

    logout(){
        const { currentUser,
            navigatorReplace,
            userFullName,logoutUser } = this.props.store;

        logoutUser();
        navigatorReplace('Exit');
    }

    onItemPress(id) {
        this.props.onChangeScene(id);
    }

    render() {
        const { route } = this.state;
        const { currentUser,
                navigatorReplace,
                userFullName,removeUserFromStorage } = this.props.store;

        return (
            <Drawer theme='light'>
                <Drawer.Header backgroundColor='#4286f5' height={140}>
                    <View style={styles.header}>
                        <Avatar size={70}
                                image={<Image source={{uri:currentUser.img}}/>}
                        />
                        <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>
                            Hello, {userFullName}
                        </Text>
                    </View>
                </Drawer.Header>

                <Drawer.Section
                    items={[{
                        icon: 'face',
                        value: 'My Profile',
                        // active: !route || route === 'welcome',
                        onPress: this.onItemPress.bind(this, "UserPage"),
                        onLongPress: this.onItemPress.bind(this, "UserPage")
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Components"
                    items={[{
                        icon: 'thumb-up',
                        value: 'Recommended',
                        active: route === 'avatars',
                        onPress: this.onItemPress.bind(this, "RecommendedPage"),
                        onLongPress: this.onItemPress.bind(this, "RecommendedPage")
                    }, {
                        icon: 'event',
                        value: 'Events',
                        active: route === 'buttons',
                        // label: '8',
                        onPress: this.onItemPress.bind(this, "EventsPage"),
                        onLongPress: this.onItemPress.bind(this, "EventsPage")
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Config"
                    items={
                    [
                        {
                            icon: 'settings',
                            value: 'Settings',
                            // label: '10',
                            active: route === 'checkboxes',
                            onPress: this.onItemPress.bind(this, "SettingsPage"),
                            onLongPress: this.onItemPress.bind(this, "SettingsPage")
                        },
                        {
                            icon: 'import-contacts',
                            value: 'About',
                            // label: '10',
                            active: route === 'dividers',
                            onPress: this.onItemPress.bind(this, "AboutPage"),
                            onLongPress: this.onItemPress.bind(this, "AboutPage")
                        },
                        {
                            icon: 'exit-to-app',
                            // value: 'Change Theme',
                            value: 'Logout',
                            // label: '24',
                            active: route === 'themes',
                            onPress: () => this.logout(),
                            onLongPress: () => navigatorReplace("Exit")
                        }
                    ]}
                />

            </Drawer>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16,
        marginBottom: 10,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginTop: 15
    },
    barak: {
        backgroundColor: '#e9eaed'
    }
};