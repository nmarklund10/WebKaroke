import os
import flask
from flask import Flask, url_for, request, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return flask.redirect('/karoke', code=302)

@app.route('/karoke')
def karoke():
    return render_template('karoke.html')

@app.route('/lrc')
def lrc():
    return render_template('lrc.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html', msg=error), 404

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)