using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class JavascriptHook : MonoBehaviour
{
    public bool checkCollision;

    [SerializeField] CloudManager cloudManager;
    [SerializeField] Scoreboard scoreBoard;
    [SerializeField] Texture scoreTexture;

    string currentEmotion;
    bool startTimer;
    int textureTimer;

    public void EmotionRecog(string data) {
        currentEmotion = data;
    }

    // Start is called before the first frame update
    void Start()
    {
        currentEmotion = "";
        textureTimer = 0;
        startTimer = false;
        checkCollision = true;
    }

    // Update is called once per frame
    void Update()
    {
        if(currentEmotion == cloudManager.lastEmoji && currentEmotion != "") {
            scoreBoard.currentScore++;
            cloudManager.lastEmoji = "";
            currentEmotion = "";
            startTimer = true;
            checkCollision = false;

            var clones = GameObject.FindGameObjectsWithTag("Emoji");
            foreach (var clone in clones) {
                FallingStatus fallingStatus = clone.GetComponent<FallingStatus>();
                if (fallingStatus.isFalling) {
                    clone.GetComponent<RawImage>().texture = scoreTexture;
                    clone.transform.GetChild(0).GetComponent<RawImage>().texture = scoreTexture;
                    clone.GetComponent<Rigidbody2D>().gravityScale = 0;
                }
            }
        }

        if(startTimer) {
            textureTimer++;
            if(textureTimer == 60) {
                var clones = GameObject.FindGameObjectsWithTag("Emoji");
                foreach (var clone in clones) {
                    if (clone.GetComponent<RawImage>().texture == scoreTexture) {
                        Destroy(clone);
                    }
                }
                textureTimer = 0;
                startTimer = false;
                checkCollision = true;
            }
        }
    }
}
