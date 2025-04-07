$(function () {
  const slider = document.querySelector('.my-slider');
  const rangeSliderPips = new RangeSliderPips({
    target: slider,
    props: {
      values: [-7, 7],
      pips: true,
      first: 'label',
      last: 'label',
      range: true,
      min: -10,
      max: 10
    }
  });

  // listen for changes to the slider and update the output
  const $output = $('#value-output');
  rangeSliderPips.$on('change', function (e) {
    $output.html(e.detail.values[0] + ',' + e.detail.values[1]);
  });
});
