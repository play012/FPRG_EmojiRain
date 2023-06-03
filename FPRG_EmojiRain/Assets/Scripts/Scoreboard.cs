using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Scoreboard : MonoBehaviour
{
    public int currentScore;
    [SerializeField] TMP_Text scoreText, highscoreText;

    public void ResetScore() {
        currentScore = 0;
    }

    // Start is called before the first frame update
    void Start()
    {
        ResetScore();
    }

    // Update is called once per frame
    void Update()
    {
        scoreText.text = currentScore.ToString();
        if (currentScore > int.Parse(highscoreText.text)) {
            highscoreText.text = currentScore.ToString();
        }
    }
}
