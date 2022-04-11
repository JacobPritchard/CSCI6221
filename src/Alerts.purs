module Alerts where

import Prelude

import Data.Maybe (Maybe(..))

import Effect (Effect)

import DocumentEvent (addEvent, inputEvent, getAlerts)

import Web.HTML (window)
import Web.HTML.Window (document)
import Web.HTML.HTMLDocument (toParentNode, HTMLDocument)
import Web.HTML.HTMLInputElement (fromEventTarget, value, HTMLInputElement)

import Web.DOM.Element (Element, toNode)
import Web.DOM.Node (textContent, setTextContent)
import Web.DOM.ParentNode (querySelector, QuerySelector(QuerySelector))

import Web.Event.Event (Event, EventType(..), target)
import Web.Event.EventTarget (EventTarget)

import Affjax as AX
import Affjax.ResponseFormat as ResponseFormat
import Data.Argonaut.Core (stringify, fromString)
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Effect.Aff (launchAff)
import Effect.Class.Console (log)

inputValue :: Maybe HTMLInputElement -> Effect String
inputValue (Just el) = value el
inputValue _ = pure ""

targetValue :: Maybe EventTarget -> Effect String
targetValue (Just et) = inputValue (fromEventTarget et)
targetValue _ = pure ""

eventValue :: Event -> Effect String
eventValue evt = targetValue (target evt)

inputEventHandler :: Maybe Element -> Event -> Effect Unit
inputEventHandler el evt = do
  str <- eventValue evt
  updateText str el

rootSelector :: QuerySelector
rootSelector = QuerySelector ("#root")

maybeText :: Maybe Element -> Effect String
maybeText (Just el) = textContent  (toNode el)
maybeText _ = pure ""

selectFromDocument :: HTMLDocument -> Effect (Maybe Element)
selectFromDocument doc = querySelector rootSelector (toParentNode doc)

updateText :: String -> Maybe Element -> Effect Unit
updateText str (Just el) = setTextContent str (toNode el)
updateText _ _ = pure unit

testApi = void $ launchAff $ do
  result <- AX.request (AX.defaultRequest { url = "https://api.openweathermap.org/data/2.5/onecall?lat=38.8950368&lon=-77.0365427&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", method = Left GET, responseFormat = ResponseFormat.json })
  case result of
    Left err -> log $ "GET /api response failed to decode: " <> AX.printError err
    Right response -> log $ "GET /api response: " <> stringify response.body

main :: Effect Unit
main = do
  w <- window 
  d <- document w
  el <- selectFromDocument d
  str <- maybeText el
  log str
  updateText "Hey! It worked!" el
  addEvent inputEvent (inputEventHandler el)
  getAlerts