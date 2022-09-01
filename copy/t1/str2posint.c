#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

/**
 * str2posint - converts a numeric string
 * (e.g. "123" as opposed to "1g3") to an int.
 * @str: the numeric string to convert.
 *
 * Note: only works for positive numeric strings
 * e.g. "123" as opposed to "-123".
 * Return: the integer representation of the string.
 */
int str2posint(char *str)
{
	int i, sum = 0, len = _strlen(str);

	for (i = 0; i < len; i++)
	{
		if (str[i] < '0' || str[i] > '9')
		{
			write(STDERR_FILENO, "Not a numeric string\n", 21);
			return (-1);
		}

		sum += _atoi2(str[i]) * pwr(10, (len - i - 1));
	}

	return (sum);
}
