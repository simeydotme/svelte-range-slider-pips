<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './Itty.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  // security level slider values

  let securityValue = 10;
  let securityMin = 2;
  let securityMax = 15;

  let securityLabels = [
    'Asking to be discovered',
    'Basically public',
    'Very unsafe',
    'Not really safe',
    'Kinda <em>almost</em> safe',
    'Safe <em>"enough"</em>',
    'Pretty safe',
    'Very safe',
    'Extremely safe',
    'Super Dooper Safe',
    'Overkill',
    'I have trust issues',
    'The feds are watching, bro!',
    'A needle in the universe'
  ];

  // time slider values

  let timeValue = 7;
  let timeMin = 2;
  let timeMax = 11;

  let timeLabels = [
    '10 seconds <small>*Demo only</small>',
    '1 Minute',
    '5 Minutes',
    '30 Minutes',
    '1 Hour',
    '1 Day',
    '1 Week',
    '1 Month',
    '1 Year',
    'Until I&nbsp;<strike>die</strike>&nbsp;Unsubscribe'
  ];

  // icons for use in the slider pips

  const unlockIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-dotted"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path fill="none" d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12h.01" /><path d="M3 12h.01" /><path d="M5 15h.01" /><path d="M5 9h.01" /><path d="M19 15h.01" /><path d="M12 18h.01" /><path d="M12 6h.01" /><path d="M8 17h.01" /><path d="M8 7h.01" /><path d="M16 17h.01" /><path d="M16 7h.01" /><path d="M19 9h.01" /></svg>`;
  const lockIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3" /></svg>`;
  const shieldIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-shield-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm.002 7a2 2 0 0 0 -1.995 1.85l-.005 .15l.005 .15a2 2 0 0 0 .995 1.581v1.769l.007 .117a1 1 0 0 0 1.993 -.117l.001 -1.768a2 2 0 0 0 -1.001 -3.732z" /></svg>`;
  
  const ghostIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-ghost"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path fill="none" d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7" /><path fill="none" d="M10 10l.01 0" /><path fill="none" d="M14 10l.01 0" /><path fill="none" d="M10 14a3.5 3.5 0 0 0 4 0" /></svg>`;
  const dayIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-hours-24"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13c.325 2.532 1.881 4.781 4 6" fill="none" /><path fill="none" d="M20 11a8.1 8.1 0 0 0 -15.5 -2" /><path d="M4 5v4h4" fill="none" /><path d="M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" fill="none" /><path d="M18 15v2a1 1 0 0 0 1 1h1" fill="none" /><path d="M21 15v6" fill="none" /></svg>`;
  const infinityIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-infinity"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path fill="none" d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" /></svg>`;


  /* format the handle for the security slider */
  const securityHandleFormatter = (value) => {
    return securityLabels[value - securityMin];
  }

  /* display icons instead of labels for the security slider pips */
  const securityFormatter = (value) => {
    if ( value <= securityMin ) {
      return unlockIcon;
    } else if ( value === 10 ) {
      return lockIcon;
    } else if ( value >= securityMax ) {
      return shieldIcon;
    }
    return '';  
  }

  /* set the color of the slider based on the security level */
  const securityColor = (value) => {
    let hue = (value - securityMin - 2) * 20;
    if ( value <= securityMin + 2 ) {
      hue = (value - securityMin) * 6;
    }
    return `hsl(${hue}, 66%, 40%)`;
  }

  /* format the handle for the time slider */
  const timeHandleFormatter = (value) => {
    return timeLabels[value - timeMin];
  }

  /* display icons instead of labels for the time slider pips */
  const timeFormatter = (value) => {
    if ( value <= timeMin ) {
      return ghostIcon;
    } else if ( value === 7 ) {
      return dayIcon;
    } else if ( value >= timeMax ) {
      return infinityIcon;
    }
    return '';  
  }

</script>

<!-- security slider -->
<RangeSlider id='itty-slider' class="itty-slider" style="--safety-color: {securityColor(securityValue)};"
  bind:value={securityValue} 
  range float pips darkmode='auto'
  min={securityMin} max={securityMax} 
  handleFormatter={securityHandleFormatter} formatter={securityFormatter}
  ariaLabels={[securityLabels[securityValue]]}
  all="label"
/>

<!-- time slider -->
<RangeSlider id='itty-slider-time' class="itty-slider" 
  bind:value={timeValue} 
  range float pips darkmode='auto'
  min={timeMin} max={timeMax} 
  handleFormatter={timeHandleFormatter} formatter={timeFormatter}
  ariaLabels={[timeLabels[timeValue]]}
  all="label"
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->