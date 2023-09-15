/*todo: label with formulary or called by right sidebar*/
/*
import React from 'react';
import { EditableLabelModel } from './EditableLabelModel';
import styled from '@emotion/styled';
import { action } from '@storybook/addon-actions';

const S = {};

// NOTE: this CSS rules allow interaction with elements in the label
S.Label = styled.div`
	user-select: none;
	pointer-events: auto;
`;

// Now we can render all that we want in the label
export const EditableLabelWidget = (props) => {
	const [str, setStr] = React.useState(props.model.value);

	return (
		<S.Label>
			<input
				value={str}
				onChange={(event) => {
					const newVal = event.target.value;

					// update value both in the internal component state
					setStr(newVal);
					// and in the model object
					props.model.value = newVal;
				}}
			/>

			<button onClick={() => action('model eventDidFire')('You clicked the button')}>Click me!</button>
		</S.Label>
	);
};
*/
