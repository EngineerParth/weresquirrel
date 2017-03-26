// var journal = [
//   {
//     events:["work", "touched tree", "pizza","running", "television"],
//     squirrel: false
//   },
//   {
//     events:["work", "ice cream", "cauliflower","lasagna", "touched tree",
//             "brushed teeth"],
//     squirrel: false
//   }
// ]
//
// function addEntry(events, didITurnIntoSquirrel){
//   journal.push({
//     events: events,
//     squirrel: didITurnIntoSquirrel
//   });
// }
//
// addEntry(["weekend", "cycling", "break", "peanuts","beer"], true);

var journal = require('./jacques_journal.js');

function phi(a){
  return (
    ((a[3]*a[0])-(a[2]*a[1]))
    /Math.sqrt(
      (a[2]+a[3])
      *(a[0]+a[1])
      *(a[0]+a[2])
      *(a[1]+a[3])
    )
  );
}

function hasEvent(_event, entry){
  return entry.events.indexOf(_event) != -1;
}

function tableFor(_event, j){
  var table = [0,0,0,0];
  for(var i = 0; i<j.length; i++){
    var entry = j[i];
    var index = 0;
    if(hasEvent(_event, entry))index++;
    if(entry.squirrel)index += 2;
    table[index] += 1;
  }
  return table;
}

var map = {};
function storePhi(_event, phi){
  map[_event] = phi;
}

function gatherCorrelations(j){
  var phis = {};
  for(var entry = 0; entry<j.length; entry++){
    var events = j[entry].events;
    for(var i = 0;i < events.length; i++){
      var _event = events[i];
      if(!phis[_event]){
        phis[_event] = phi(tableFor(_event, j));
      }
    }
  }
  return phis;
}

function gatherCorrelationsOfInterest(c){
  var ci = {};
  for(var _event in c){
    var correlation = c[_event];
    if(correlation < -0.1 || correlation > 0.1){
      ci[_event] = correlation;
      console.log(_event + "->" + correlation);
    }
  }
  return ci;
}

var correlationsOfInterest = gatherCorrelationsOfInterest(gatherCorrelations(journal));

var maxCorrelation = Number.NEGATIVE_INFINITY,
                      mxcEvent,
                      minCorrelation = Number.POSITIVE_INFINITY,
                      micEvent;

for(_event in correlationsOfInterest){
  var correlation = correlationsOfInterest[_event];
  if(correlation > maxCorrelation){
    maxCorrelation = correlation;
    mxcEvent = _event;
  }
  if(correlation < minCorrelation){
    minCorrelation = correlation;
    micEvent = _event;
  }
}

console.log("max correlation: "+mxcEvent+"->"+maxCorrelation);
console.log("min correlation: "+micEvent+"->"+minCorrelation);

var suspectEvent = mxcEvent+" and not "+micEvent;

for(var i = 0; i < journal.length; i++){
  var entry = journal[i];
  if(hasEvent(mxcEvent, entry) && !hasEvent(micEvent, entry)){
    entry.events.push(suspectEvent);
  }
}

console.log(suspectEvent + "->" +phi(tableFor(suspectEvent, journal)));
