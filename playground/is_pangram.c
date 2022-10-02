#include <stdio.h>
#include <stdlib.h>
#include "main.h"

int alphafull(char *ptc);

/**
 * is_pangram - checks if str contains at least one occurence of all alphabets.
 * @str: string to check if pangram.
 * 
 * Description: a pangram is a sentence that contains at least one
 * instance of all letters of the alphabet, case in-sensitive.
 * Return: 1 if str is a pangram; 0 otherwise.
 */
int is_pangram(char *str)
{
	int i;
	char alpha[26];

	/* init alpha */
	for (i = 0; i < 26; i++)
	{
		alpha[i] = 0;
	}

	for (i = 0; str[i]; i++)
	{
		/* check for filled alpha every 26 characters iterated over */
		if (i % 25 == 0)
		{
			if (alphafull(alpha))
			{
				return (1);
			}
		}

		if ((str[i] >= 65 && str[i] <= 90) || (str[i] >= 97 && str[i] <= 122))
		{
			alpha[charhash(str[i])] = 1;
		}
	}

	if (alphafull(alpha))
	{
		return (1);
	}

	return (0);
}


/**
 * alphafull - checks if any null-byte exists in alpha.
 * @ptc: array originally initialized with null bytes.
 *
 * Return: 0 if a null byte exists; 1 otherwise.
 */
int alphafull(char *ptc)
{
	int i;

	for (i = 0; i < 26; i++)
	{
		if (ptc[i] == 0)
		{
			return (0);
		}
	}

	return (1);
}
