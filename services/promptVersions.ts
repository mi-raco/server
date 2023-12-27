import dataAPI from './integrations/mongoDataAPI';

export interface PromptVersion {
  action_id: string;
  status: "Testing" | "Live";
  system_instructions: string;
  user_input_template: string;
}

export default {
  async getLivePromptVersion(actionId: string, data=dataAPI): Promise<PromptVersion> {
    const promptVersion = data.findOne(
      'promptVersions', 
      {actionId: actionId, status: "Live"}
    )
    .then((response) => response.document as PromptVersion);
    return promptVersion;
  },

  populateUserInputTemplate(promptVersion: PromptVersion, parameters: Record<string, string>) {
  const user_input = promptVersion.user_input_template.replace(
    /\${(\w+)}/g, 
    (_, v) => parameters[v]
  );
    return user_input;
  },
}