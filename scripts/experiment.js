var timeline = []

// ----------------------------------------------------------------------------
// WELCOME MESSAGE ------------------------------------------------------------
var welcome = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome);

// ----------------------------------------------------------------------------
// INSTRUCTIONS ---------------------------------------------------------------
var instructions = {
  type: "html-keyboard-response",
  stimulus: "INSTRUCTIONS"
};
timeline.push(instructions);

// ----------------------------------------------------------------------------
// STIMULI --------------------------------------------------------------------
// 1. FIXATION CROSS
function sampleFixationTime(){
    t = Math.random() * 200 + 800
    return t
};
var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: sampleFixationTime,
  data: {test_part: "fixation"}
};

// 2. RDK
var instructionSettings = {adhere: "green", oppose: "red", detach: "blue"};
var onsetSettings = {early: 500, late: 1500};
var orientationSettings = {right: 0, left: 180}
var responseSettings = {right: 37, left: 39}

var factors = {dot_color_post: Object.values(instructionSettings),
               t_color_transition: Object.values(onsetSettings),
               coherent_direction: Object.values(orientationSettings)};
var full_design = jsPsych.randomization.factorial(factors);

var RDK_stim = {
    type: "RDK",
    dot_color_pre: "black",
    dot_color_post: jsPsych.timelineVariable("dot_color_post"),
    trial_duration: 2000,
    t_color_transition: jsPsych.timelineVariable("t_color_transition"),
    aperture_type: 1,
    coherent_direction: jsPsych.timelineVariable("coherent_direction"),
    choices: Object.values(responseSettings),
    on_finish: function(data){
        data.instruction = (_.invert(instructionSettings))[data.dot_color_post];
        data.onset = (_.invert(onsetSettings))[data.t_color_transition];
        data.correct = (_.invert(responseSettings))[data.key_press] == (_.invert(orientationSettings))[data.coherent_direction];
    }
};

// 2. FoC SLIDER
var FoC_labels = [
    "<font size=4>My response was determined <br> entirely by what I saw on screen.</font>",
    "<font size=4>I decided what to do myself, <br> completely independently of what <br> was shown on the screen.</font>"
]
var FoC_limits = [0, 100]
var FoC_slider = {
    type: "html-slider-response",
    labels: FoC_labels,
    stimulus: " ",
    min: FoC_limits[0],
    max: FoC_limits[1],
    start: function(){Math.floor(Math.random() * FoC_limits[1])},
    trial_duration: 3000
}

// ----------------------------------------------------------------------------
// TRIAL DESIGN ---------------------------------------------------------------
var trialProcedure = {
  timeline: [fixation, RDK_stim, FoC_slider],
  timeline_variables: full_design,
  randomize_order: true,
  repetitions: 1
};

timeline.push(trialProcedure);

// ----------------------------------------------------------------------------
// INITIALISATION -------------------------------------------------------------
jsPsych.init({
  timeline: timeline,
  on_finish: function(){
      jsPsych.data.displayData();
  }
});
