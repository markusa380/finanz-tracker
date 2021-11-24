## Requirements

Locally installed software:

- Docker Desktop
- Node.js
- NPM
- AWS CLI

## Setup steps

- [Configure AWS CLI credentials](https://docs.aws.amazon.com/cdk/latest/guide/cli.html#cli-environment)
- [Bootstrap AWS environment](https://docs.aws.amazon.com/cdk/latest/guide/cli.html#cli-bootstrap)
- [Deploy the stack](https://docs.aws.amazon.com/cdk/latest/guide/cli.html#cli-deploy)

## Useful commands

- `npm install` to install all dependencies
- `npm run build` compile typescript to js
- `cdk deploy --parameters <params>` deploy this stack to your default AWS account/region
- `cdk destroy` destroy this stack (use with caution)
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `aws logs tail $group_name --follow` to watch logs of a log group in AWS
- `npm install -g aws-cdk` to update CDK
- `npm -g uninstall aws-cdk` then `npm -g install aws-cdk` in case of `Cloud assembly schema version mismatch` error
