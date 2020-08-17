import styled from 'styled-components';
import { Colors } from '../../styles/colors';

export const Btn = styled.button`
  border: 4px solid ${Colors.Text};
  background: ${Colors.BackgroundAlt};
  color: ${Colors.Text};
  font-size: 20px;
  padding: 5px 20px;

  &:disabled {
    background: ${Colors.BackgroundDisabled};
    color: ${Colors.Text};
  }

  &:hover {
    background: ${Colors.Text};
    color: ${Colors.BackgroundAlt};
  }

  &:focus {
    outline: 4px solid ${Colors.BackgroundAlt}; // Keep the accessibility as a way to go :D
  }
`;
