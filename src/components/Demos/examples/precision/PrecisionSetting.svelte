<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './PrecisionSetting.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  // settings for the slider
  const precision = 4;
  const step = 0.0001;
  
  // bindings for the video element and its properties
  let videoElement;
  $: duration = videoElement?.duration;
  let currentTime = 0;
  let buffers = [];
  let bufferStyle = '';

  /* formatting the float as time (mm:ss.ss) with 2 decimal places, 
    even though precision is set to 4 */
  const minuteFormat = new Intl.NumberFormat('en', { minimumIntegerDigits: 1 });
  const secondFormat = new Intl.NumberFormat('en', { minimumIntegerDigits: 2, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const timeFormat = (v) => `${minuteFormat.format(Math.floor(v / 60))}:${secondFormat.format(v % 60).split('.')[0]}<small>.${secondFormat.format(v % 60).split('.')[1]}</small>`;
  

  /* I'm showing the buffered ranges as a gradient background */
  const updateBufferStyle = (e) => {
    buffers = [];
    if( !duration ) return;
    for (let i = 0; i < videoElement.buffered.length; i++) {
      const start = videoElement.buffered.start(i) / duration * 100;
      const end = videoElement.buffered.end(i) / duration * 100;
      buffers = [...buffers, { start, end }];
    }
    bufferStyle = `background-image: linear-gradient(to right, transparent, ${buffers.map((range, index) => 
      `transparent ${range.start}%, #94b28d ${range.start}%, #94b28d ${range.end}%, transparent ${range.end}%, transparent`
    ).join(', ')})`;
  };
  
</script>

<RangeSlider 
  id="seek-slider"
  bind:value={currentTime} 
  {step} 
  {precision} 
  max={duration} 
  float
  range='min'
  formatter={timeFormat}
  style={bufferStyle}
/>

<video 
  bind:this={videoElement}
  src="/carminandes-2.mp4" 
  controls 
  bind:currentTime 
  bind:duration
  on:seeked={updateBufferStyle}
  on:play={updateBufferStyle}
/>

<code data-values title="The video properties">currentTime: {currentTime} / duration: {duration}</code>


<!-- hide -->
{@html renderCss}
<!-- endhide -->