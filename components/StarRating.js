import React, { Fragment } from 'react';
import { Easing } from 'react-native';
import Rating from 'react-native-rating';

export default class StarRating extends React.Component {
    render() {
        const starFilled = require('../images/round_star_yellow_36dp.png');
        const starUnfilled = require('../images/round_star_border_yellow_36dp.png');

        return (
            <Rating
                onChange={this.props.onChange}
                selectedStar={starFilled}
                unselectedStar={starUnfilled}
                config={{
                    easing: Easing.inOut(Easing.ease),
                    duration: 200
                }}
                stagger={20}
                maxScale={0.2}
                starStyle={{
                    width: 32,
                    height: 32
                }}
            />
        );
    }
}
