import { expect, sinon } from './testSetup'
import prompts, {PromptVersion} from '../services/promptVersions';

describe('promptVersions tests', () => {
  it ('populates a user input template', () => {
    const promptVersion: PromptVersion = {
      action_id: "test",
      status: "Live",
      system_instructions: "test",
      user_input_template: "Hello ${name}"
    }
    const parameters = {name: "World"};
    const response = prompts.populateUserInputTemplate(promptVersion, parameters);
    expect(response).to.equal("Hello World");
  });
});