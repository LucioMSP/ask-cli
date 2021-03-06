const R = require('ramda');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');
const stringUtils = require('@src/utils/string-utils');
const CONSTANTS = require('@src/utils/constants');

const SKIP_DEPLOY_DELEGATE_SELECTION = 'deploy skill infrastructure manually';

module.exports = {
    getSkillName,
    getProjectFolderName,
    selectSkillCodeLanguage,
    getTargetTemplateName,
    confirmUsingUnofficialTemplate,
    getDeployDelegateType,

    SKIP_DEPLOY_DELEGATE_SELECTION
};

function getSkillName(url, callback) {
    const defaultName = path.basename(url, path.extname(url));
    inquirer.prompt([{
        message: 'Please type in your skill name: ',
        type: 'input',
        default: defaultName,
        name: 'skillName',
        validate: (input) => {
            if (!stringUtils.isNonBlankString(input)) {
                return 'Skill name can\'t be empty.';
            }
            return true;
        }
    }]).then((answer) => {
        callback(null, answer.skillName.trim());
    }).catch((error) => {
        callback(error);
    });
}

function getProjectFolderName(defaultName, callback) {
    inquirer.prompt([{
        message: 'Please type in your folder name for the skill project (alphanumeric): ',
        type: 'input',
        default: defaultName,
        name: 'projectFolderName',
        validate: (input) => {
            if (!input || stringUtils.filterNonAlphanumeric(input) === '') {
                return 'Project folder name should be consisted of alphanumeric character(s) plus "-" only.';
            }
            return true;
        }
    }]).then((answer) => {
        callback(null, stringUtils.filterNonAlphanumeric(answer.projectFolderName));
    }).catch((error) => {
        callback(error);
    });
}

function selectSkillCodeLanguage(callback) {
    inquirer.prompt([{
        type: 'list',
        message: 'Please select the programming language to write your Alexa skill: ',
        name: 'language',
        choices: Object.keys(CONSTANTS.TEMPLATES.LANGUAGE_MAP)
    }]).then((answer) => {
        callback(null, answer.language.trim());
    }).catch((error) => {
        callback(error);
    });
}

function getTargetTemplateName(templateMap, callback) {
    const templateList = R.keys(templateMap).map((templateName) => {
        const description = templateMap[templateName].description || '';
        return `${templateName}\t\t    ${chalk.gray(description)}`;
    });
    inquirer.prompt([{
        type: 'list',
        message: 'Please select the skill template to start with: ',
        name: 'templateName',
        choices: templateList,
        filter: input => input.replace(/\s{4}.*/g, '')
    }]).then((answer) => {
        callback(null, answer.templateName);
    }).catch((error) => {
        callback(error);
    });
}

function confirmUsingUnofficialTemplate(callback) {
    inquirer.prompt([{
        message: 'Would you like to continue download the skill template? ',
        type: 'confirm',
        name: 'confirmation',
        default: false
    }]).then((answer) => {
        callback(null, answer.confirmation);
    }).catch((error) => {
        callback(error);
    });
}

function getDeployDelegateType(ddMap, callback) {
    const deployDelegateChoices = R.keys(ddMap).map((ddType) => {
        const description = ddMap[ddType].description || '';
        return `${ddType}\n  ${chalk.gray(description)}`;
    });
    deployDelegateChoices.push(new inquirer.Separator());
    deployDelegateChoices.push(SKIP_DEPLOY_DELEGATE_SELECTION);
    inquirer.prompt([{
        message: 'Please specify the type of deploy delegate to deploy your skill infrastructures: ',
        type: 'list',
        name: 'deployDelegate',
        choices: deployDelegateChoices,
        filter: input => input.replace(/\n.*/g, '')
    }]).then((answer) => {
        callback(null, answer.deployDelegate);
    }).catch((error) => {
        callback(error);
    });
}
