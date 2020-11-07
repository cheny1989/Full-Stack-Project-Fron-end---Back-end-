import React, { Component } from 'react';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.user1Input = React.createRef();
        this.user2Input = React.createRef();

        this.state = {
            user1: '',
            user2: '',
            messages: [],
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/messages')
            .then(res => res.json())
            .then(messages => this.setState({ messages }));
    }

    handleUser1Input() {
        const text = this.user1Input.current.value;
        const message = { user: "user1", text }
        this.saveMessage(message);
    }

    handleUser2Input() {
        const text = this.user2Input.current.value;
        const message = { user: "user2", text }
        this.saveMessage(message);
    }

    saveMessage(message) {
        fetch('http://localhost:8080/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        }).then(res => res.json())
            .then(message =>
                this.setState({ messages: [...this.state.messages, message] })
            );
    }

    removeMessages(messageId) {
        fetch(`http://localhost:8080/messages/${messageId}`,{
            method: 'DELETE',
        }).then(res => res.json())
            .then(message => {
                const newArray = this.state.messages.filter(m => m.id !== parseInt(messageId));
                this.setState({ messages: newArray })
            });
    }

    render() {
        return (
            <div>
                User 1: <input type="text" ref={this.user1Input} />
                <button onClick={() => this.handleUser1Input()}>Send</button>
                <br />
                User 2: <input type="text" ref={this.user2Input} />
                <button onClick={() => this.handleUser2Input()}>Send</button>
                <hr />

                <h1>Messages</h1>
                {this.state.messages.map(m =>
                    <div>{m.user}: {m.text} <button onClick={() => this.removeMessages(m.id)}>Remove</button>
                        <hr />
                    </div>
                )}
            </div>
        );
    }
}

export default Chat;