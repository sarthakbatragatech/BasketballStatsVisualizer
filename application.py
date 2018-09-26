import os
import re
from flask import Flask, jsonify, render_template, request, url_for, send_from_directory
# Flask-JSGlue provides a client-side url_for(), which makes source codes dynamic and more charming.
from flask_jsglue import JSGlue

#configure app, set up an instance of the Flask Classj
app = Flask(__name__)
JSGlue(app)

@app.route("/")
def home():
	return render_template("home.html")

@app.route("/<string:filename>")
def main(filename):
	return render_template(filename)

if __name__ == "__main__":
	app.run(debug = True)