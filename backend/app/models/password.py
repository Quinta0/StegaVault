from .. import db


class Password(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    site = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(120), nullable=False)
    encrypted_password = db.Column(db.String(256), nullable=False)
    file_path = db.Column(db.String(256), nullable=False)
    type = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<Password {self.site}>'
