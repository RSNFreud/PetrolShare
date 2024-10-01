import {Button} from '@components/layout/button';
import {logOut} from '@pages/login/reducers/auth';
import {useDispatch} from 'react-redux';

const Homepage = () => {
    const dispatch = useDispatch();

    return (
        <>
            <Button onPress={() => dispatch(logOut())}>Logout!</Button>
        </>
    );
};

export default Homepage;
