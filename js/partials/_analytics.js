function sendEvent(c, a, l, v) {
  if (v) {
    ga('send', 'event', { eventCategory: c, eventAction: a, eventLabel: l, eventValue:v });
    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l+', VALUE:'+v);
    }
  } else if (l) {
    ga('send', 'event', { eventCategory: c, eventAction: a, eventLabel: l });
    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l);
    }
  } else {
    ga('send', 'event', { eventCategory: c, eventAction: a });
    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a);
    }
  }
}