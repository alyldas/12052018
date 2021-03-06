/**
 * @fileOverview	Functions and procedures for Markov Alghoritm Emulator.
 * @author			Andrey Markov
 * @version			0.0.3
 */

/**
 * Adds a new step to the list of steps.
 * @param	{string}	step The rule that will be added.
 * @return	{undefined}	This function does not have a return value.
 */
function addStep(step) {
	document.getElementById("steps").innerHTML +=
		"<li>" + step + "</li>";
}

/**
 * Clears the list of steps.
 * @return	{undefined}	This function does not have a return value.
 */
function clearSteps() {
	document.getElementById("steps").innerHTML = "";
}

/**
 * Displays the error message to the user.
 * @param	{string}	Error message.
 * @return	{undefined}	This function does not have a return value.
 */
function displayError(error) {
	document.getElementById("error").innerHTML = error;
}

/**
 * Compiles the rule.
 * @param	{string}	rule			Rule in the form of a string.
 * @prop	{object}	compiledRule	Compiled rule.
 * @prop	{string}	compiledRule.0	Raw rule as a string.
 * @prop	{string}	compiledRule.1	The left side of the rule.
 * @prop	{string}	compiledRule.2	Terminal flag.
 * @prop	{string}	compiledRule.3	The right side of the rule.
 * @return	{compiledRule}
 */
function compileRule(rule) {
	return /\s*(\S*)\s*[=-]>(\.)*\s*(\S*)\s*/i.exec(rule);
}

/**
 * Checks the compiled rule for errors.
 * @param	{compiledRule}	rule	Rule for verification.
 * @return	{boolean}
 */
function checkRule(rule) {
	if ((!rule) || (rule && rule[1] == rule[3]))
		return false
	else
		return true;
}

/**
 * Array of rules.
 * @type {compiledRule[]}
 */
var rules = [];

/**
 * Compiles rules.
 * @return	{string}
 On error, returns the rule in which the error occurred.
 */
function compileRules() {
	rawRules = document.getElementById("rules").value.split('\n');
	for (i = 0; i < rawRules.length; i++) {
		rule = compileRule(rawRules[i]);
		if (checkRule(rule))
			rules.push(rule)
		else
			return rawRules[i];
	}
}

/**
 * The status flag of the steps.
 * @type {boolean}
 */
var done = false;

/**
 * Applies the rule if possible.
 * @return {string|undefined} If the rule was applied,
 then returns the changes, otherwise "undefined".
 */
function doStep() {
	if (!done)
		for (i = 0; i < rules.length; i++) {
			word = document.getElementById("word").value;
			oldWord = word;
			word = word.replace(rules[i][1], rules[i][3]);
			if (word != oldWord) {
				document.getElementById("word").value = word;

				// Shorthand does not work properly.
				step = oldWord + " ->";
				if (rules[i][2] == ".") {
					done = true;
					step += ". ";
				} else
					step += " ";
				step += word;

				return step;
			}
		}
}

/**
 * Performs the algorithm.
 * @return {undefined} This procedure does not have a return value.
 */
function run() {
	rules = []; // clear rules
	done = false; // reset done flag
	clearSteps(); // clear user-side
	displayError(""); // reset error
	compileRulesReturn = compileRules();
	if (compileRulesReturn) {
		displayError("Ошибка в правиле <code>\"" +
			compileRulesReturn + "\"</code>.");
		return;
	}
	if (rules.length == 0) {
		displayError("Введите правила.");
		return;
	}
	var step;
	var i = 0;
	while ((step = doStep()) != undefined) {
		if (i > 98) {
			displayError("Exceeded the number of rules applied.\
				Early termination of the algorithm.");
			alert("Exceeded the number of rules applied.\
				Early termination of the algorithm.");
			return;
		}
		addStep(step);
		i++;
	};
}