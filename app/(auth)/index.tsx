import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {useDispatch} from 'react-redux';
import {logOut} from 'src/reducers/auth';

const Homepage = () => {
    const dispatch = useDispatch();

    return (
        <>
            <Button onPress={() => dispatch(logOut())}>Logout!</Button>
        </>
    );
};

export default Homepage;
