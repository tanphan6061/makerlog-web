import Message from 'components/ui/Message';
import React from 'react'

function ModStatus({ thread = null, reply = null, }) {
    const object = thread || reply;

    if (!object.hidden && !object.locked) return null;

    const message = object.hidden && object.locked ? "This item was locked and hidden by a moderator." : (
        object.hidden ? "This item was hidden by a moderator." : "This item was locked by a moderator."
    )

    return (
        <Message info title={message}>
            {object.mod_reason ? object.mod_reason : null}
        </Message>
    )
}

export default ModStatus