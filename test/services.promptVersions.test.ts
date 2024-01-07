import { expect, sinon } from './testSetup'
import prompts, {PromptVersion, Template} from '../services/promptVersions';

describe('promptVersions tests', () => {
  it ('populates a user input template', () => {
    const template: Template[] = [
      {role: "system", content: "test"},
      {role: "user", content: "Hello ${name}"}
    ];
    const promptVersion: PromptVersion = {template}
    const parameters = {name: "World"};
    const response = prompts.populateUserInputTemplate(promptVersion, parameters);
    expect(response).to.equal("Hello World");
  });
});