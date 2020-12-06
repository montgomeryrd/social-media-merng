import { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/Hooks';

const Register = ( props ) => {

    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    // Backdoor function to include addUser to callback in destructuring useForm
    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={ onSubmit } noValidate className={ loading ? "loading" : "" }>
                <h1>Register</h1>
                <Form.Input
                    label="username"
                    placeholder="username..."
                    name="username"
                    type="text"
                    value={ values.username }
                    error={ errors.username ? true : false }
                    onChange={ onChange }
                />
                <Form.Input
                    label="email"
                    placeholder="email..."
                    name="email"
                    type="email"
                    value={ values.email }
                    error={ errors.email ? true : false }
                    onChange={ onChange }
                />
                <Form.Input
                    label="password"
                    placeholder="password..."
                    name="password"
                    type="password"
                    value={ values.password }
                    error={ errors.password ? true : false }
                    onChange={ onChange }
                />
                <Form.Input
                    label="confirm password"
                    placeholder="confirm password..."
                    name="confirmPassword"
                    type="password"
                    value={ values.confirmPassword }
                    error={ errors.confirmPassword ? true : false }
                    onChange={ onChange }
                />
                <Button type="submit" primary>Register</Button>
            </Form>
            { Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        { Object.values(errors).map(item => (
                            <li key={ item }>{ item }</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Register;